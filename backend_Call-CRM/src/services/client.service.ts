import prisma from "../utils/prisma";
import { Prisma, ClientStatus } from "@prisma/client";

export const createClient = async (data: Prisma.ClientCreateInput) => {
  return prisma.client.create({
    data,
  });
};

export const getClientById = async (id: string) => {
  return prisma.client.findUnique({
    where: { id },
    include: { project: { select: { name: true } } },
  });
};

export const updateClient = async (
  id: string,
  data: Prisma.ClientUpdateInput,
) => {
  return prisma.client.update({
    where: { id },
    data,
  });
};

export const deleteClient = async (id: string) => {
  return prisma.client.delete({
    where: { id },
  });
};

export const getClients = async (params: {
  page?: number;
  limit?: number;
  name?: string;
  phone?: string;
  company?: string;
  projectId?: string;
  status?: ClientStatus;
  search?: string;
}) => {
  const {
    page = 1,
    limit = 20,
    name,
    phone,
    company,
    projectId,
    status,
    search,
  } = params;

  const where: Prisma.ClientWhereInput = {};

  if (search) {
    const searchTerms = search.trim();
    where.OR = [
      { name: { contains: searchTerms, mode: "insensitive" } },
      { phone: { contains: searchTerms } },
      { company: { contains: searchTerms, mode: "insensitive" } },
      { inn: { contains: searchTerms } },
      { responsible: { contains: searchTerms, mode: "insensitive" } },
    ];
  } else {
    if (name) {
      where.name = { contains: name, mode: "insensitive" };
    }
    if (phone) {
      where.phone = { contains: phone };
    }
    if (company) {
      where.company = { contains: company, mode: "insensitive" };
    }
  }

  if (projectId) {
    where.projectId = projectId;
  }

  if (status) {
    where.status = status;
  }

  const [clients, total] = await Promise.all([
    prisma.client.findMany({
      where,
      include: { project: { select: { name: true } } },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.client.count({ where }),
  ]);

  return {
    clients,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const createClientsBulk = async (data: any[]) => {
  return await prisma.client.createMany({
    data,
    skipDuplicates: true,
  });
};
