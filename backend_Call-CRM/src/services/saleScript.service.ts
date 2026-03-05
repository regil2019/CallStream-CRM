import prisma from "../utils/prisma";
import { Prisma } from "@prisma/client";

export const createScript = async (data: {
  title: string;
  content: string;
  category?: string;
}) => {
  return (prisma as any).saleScript.create({
    data,
  });
};

export const getScripts = async () => {
  return (prisma as any).saleScript.findMany({
    orderBy: { createdAt: "desc" },
  });
};

export const updateScript = async (
  id: string,
  data: { title?: string; content?: string; category?: string },
) => {
  return (prisma as any).saleScript.update({
    where: { id },
    data,
  });
};

export const deleteScript = async (id: string) => {
  return (prisma as any).saleScript.delete({
    where: { id },
  });
};
