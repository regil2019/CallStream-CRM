import prisma from "../utils/prisma";

export const createTemplate = async (data: {
  title: string;
  content: string;
  type?: string;
}) => {
  return (prisma as any).objectionTemplate.create({
    data,
  });
};

export const getTemplates = async () => {
  return (prisma as any).objectionTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const updateTemplate = async (
  id: string,
  data: { title?: string; content?: string; type?: string },
) => {
  return (prisma as any).objectionTemplate.update({
    where: { id },
    data,
  });
};

export const deleteTemplate = async (id: string) => {
  return (prisma as any).objectionTemplate.delete({
    where: { id },
  });
};
