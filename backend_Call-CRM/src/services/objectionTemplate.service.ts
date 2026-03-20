import prisma from "../utils/prisma";
import { Prisma } from "@prisma/client";

export const createTemplate = async (data: Prisma.ObjectionTemplateCreateInput) => {
  return prisma.objectionTemplate.create({
    data,
  });
};

export const getTemplates = async () => {
  return prisma.objectionTemplate.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const updateTemplate = async (
  id: string,
  data: Prisma.ObjectionTemplateUpdateInput,
) => {
  return prisma.objectionTemplate.update({
    where: { id },
    data,
  });
};

export const deleteTemplate = async (id: string) => {
  return prisma.objectionTemplate.delete({
    where: { id },
  });
};
