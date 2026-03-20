import prisma from "../utils/prisma";
import { Prisma } from "@prisma/client";

export const createScript = async (data: Prisma.SaleScriptCreateInput) => {
  return prisma.saleScript.create({
    data,
  });
};

export const getScripts = async () => {
  return prisma.saleScript.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const updateScript = async (
  id: string,
  data: Prisma.SaleScriptUpdateInput,
) => {
  return prisma.saleScript.update({
    where: { id },
    data,
  });
};

export const deleteScript = async (id: string) => {
  return prisma.saleScript.delete({
    where: { id },
  });
};
