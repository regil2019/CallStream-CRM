import prisma from "../utils/prisma";

export const getCallStats = async (filters: {
  projectId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
}) => {
  const where: any = {};
  if (filters.projectId) where.projectId = filters.projectId;
  if (filters.userId) where.userId = filters.userId;
  if (filters.startDate || filters.endDate) {
    where.createdAt = {};
    if (filters.startDate) where.createdAt.gte = filters.startDate;
    if (filters.endDate) where.createdAt.lte = filters.endDate;
  }

  const totalCalls = await prisma.call.count({ where });

  const successfulCalls = await prisma.call.count({
    where: {
      ...where,
      status: "completed",
    },
  });

  const successRate = totalCalls > 0 ? (successfulCalls / totalCalls) * 100 : 0;

  const callsByUser = await prisma.call.groupBy({
    by: ["userId"],
    where,
    _count: {
      id: true,
    },
  });

  const users = await prisma.user.findMany({
    where: {
      id: { in: callsByUser.map((c: any) => c.userId) },
    },
    select: { id: true, name: true, email: true },
  });

  const managerStats = callsByUser.map((stat: any) => {
    const user = users.find((u) => u.id === stat.userId);
    return {
      userId: stat.userId,
      userName: user?.name || user?.email || "Неизвестный",
      count: stat._count.id,
    };
  });

  const callsByProject = await prisma.call.groupBy({
    by: ["projectId", "result"],
    where: {
      ...where,
      projectId: { not: null },
    },
    _count: {
      id: true,
    },
  });

  const projects = await prisma.project.findMany({
    where: {
      id: { in: callsByProject.map((c: any) => c.projectId as string) },
    },
    select: { id: true, name: true },
  });

  const projectStats = projects.map((project) => {
    const projectResults = callsByProject
      .filter((c: any) => c.projectId === project.id)
      .map((c: any) => ({
        result: c.result || "Без результата",
        count: c._count.id,
      }));

    return {
      projectId: project.id,
      projectName: project.name,
      results: projectResults,
      total: projectResults.reduce((sum: number, r: any) => sum + r.count, 0),
    };
  });

  const durationAgg = await prisma.call.aggregate({
    _avg: { duration: true },
    where,
  });
  const averageCallDuration = durationAgg._avg.duration || 0;

  const allCallsForTimeline = await prisma.call.findMany({
    where,
    select: { createdAt: true },
  });
  const callsByDayMap = new Map<string, number>();
  allCallsForTimeline.forEach((call: any) => {
    const dateStr = call.createdAt.toISOString().split("T")[0];
    callsByDayMap.set(dateStr, (callsByDayMap.get(dateStr) || 0) + 1);
  });
  const callsByDay = Array.from(callsByDayMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const callsByResultRaw = await prisma.call.groupBy({
    by: ["result"],
    where,
    _count: { id: true },
  });
  const callsByResult = callsByResultRaw.map((item: any) => ({
    result: item.result || "Без результата",
    count: item._count.id,
  }));

  const clientWhere: any = {};
  if (filters.projectId) clientWhere.projectId = filters.projectId;
  if (filters.startDate || filters.endDate) {
    clientWhere.createdAt = {};
    if (filters.startDate) clientWhere.createdAt.gte = filters.startDate;
    if (filters.endDate) clientWhere.createdAt.lte = filters.endDate;
  }
  const totalClients = await prisma.client.count({ where: clientWhere });

  return {
    totalCalls,
    totalClients,
    successfulCalls,
    successRate: Math.round(successRate * 100) / 100,
    averageCallDuration,
    callsByDay,
    callsByResult,
    managerStats,
    projectStats,
  };
};
