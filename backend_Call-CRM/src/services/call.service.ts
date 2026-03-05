import prisma from "../utils/prisma";
import { Prisma } from "@prisma/client";

export const createCallLog = async (data: any) => {
  return prisma.call.create({
    data,
  });
};

export const getCallLogs = async (params: {
  page?: number;
  limit?: number;
  userId?: string;
  clientId?: string;
  projectId?: string;
  status?: string;
}) => {
  const { page = 1, limit = 20, userId, clientId, projectId, status } = params;

  const where: any = {};

  if (userId) where.userId = userId;
  if (clientId) where.clientId = clientId;
  if (projectId) where.projectId = projectId;
  if (status) where.status = { contains: status, mode: "insensitive" };

  const [logs, total] = await Promise.all([
    prisma.call.findMany({
      where,
      include: {
        client: { select: { name: true, phone: true } },
        user: { select: { name: true, email: true } },
        project: { select: { name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.call.count({ where }),
  ]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
