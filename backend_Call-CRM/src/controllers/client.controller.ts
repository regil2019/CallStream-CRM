import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as clientService from "../services/client.service";
import { successResponse } from "../utils/response";
import { ClientStatus } from "@prisma/client";
import { mapStatusToBackend } from "../utils/statusMapper";

import { phoneSchema, emailSchema, isValidInn } from "../utils/validation";

const relaxedInnSchema = z.preprocess(
  (val) => (typeof val === "string" ? val.replace(/\D/g, "") : val),
  z.string().optional().nullable().transform((val) => {
    if (!val) return null;
    return (val.length === 10 || val.length === 12) && isValidInn(val)
      ? val
      : null;
  }),
);

const createClientSchema = z.object({
  name: z.string().min(1, "Имя обязательно"),
  phone: phoneSchema,
  company: z.string().optional(),
  inn: relaxedInnSchema,
  email: emailSchema.optional().nullable(),
  projectId: z
    .string()
    .uuid()
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  status: z
    .string()
    .optional()
    .transform((val) =>
      val ? (mapStatusToBackend(val) as ClientStatus) : undefined,
    ),
  tags: z.array(z.string()).optional(),
  responsible: z.string().optional(),
  notes: z.string().optional(),
});

const updateClientSchema = z.object({
  name: z.string().min(1).optional(),
  phone: phoneSchema.optional(),
  company: z.string().optional(),
  inn: relaxedInnSchema,
  email: emailSchema.optional().nullable(),
  projectId: z
    .string()
    .uuid()
    .optional()
    .nullable()
    .or(z.literal("").transform(() => null)),
  status: z
    .string()
    .optional()
    .transform((val) =>
      val ? (mapStatusToBackend(val) as ClientStatus) : undefined,
    ),
  tags: z.array(z.string()).optional(),
  responsible: z.string().optional(),
  notes: z.string().optional(),
});

export const createClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = createClientSchema.parse(req.body);
    const client = await clientService.createClient(data as any);
    successResponse(res, client, 201);
  } catch (error) {
    if ((error as any).code === "P2002") {
      const conflictError = new Error(
        "Клиент с таким телефоном уже существует",
      );
      (conflictError as any).statusCode = 409;
      return next(conflictError);
    }
    next(error);
  }
};

export const getClientById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const client = await clientService.getClientById(id);

    if (!client) {
      const error = new Error("Клиент не найден");
      (error as any).statusCode = 404;
      throw error;
    }

    successResponse(res, client);
  } catch (error) {
    next(error);
  }
};

export const updateClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = updateClientSchema.parse(req.body);
    const client = await clientService.updateClient(id, data as any);
    successResponse(res, client);
  } catch (error) {
    if ((error as any).code === "P2025") {
      const notFoundError = new Error("Клиент не найден");
      (notFoundError as any).statusCode = 404;
      return next(notFoundError);
    }
    if ((error as any).code === "P2002") {
      const conflictError = new Error(
        "Клиент с таким телефоном уже существует",
      );
      (conflictError as any).statusCode = 409;
      return next(conflictError);
    }
    next(error);
  }
};

export const deleteClient = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await clientService.deleteClient(id);
    successResponse(res, { message: "Клиент успешно удален" });
  } catch (error) {
    if ((error as any).code === "P2025") {
      const notFoundError = new Error("Клиент не найден");
      (notFoundError as any).statusCode = 404;
      return next(notFoundError);
    }
    next(error);
  }
};

export const getClients = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const name = req.query.name as string;
    const phone = req.query.phone as string;
    const company = req.query.company as string;
    const projectId = req.query.projectId as string;
    let status = req.query.status as string;
    const search = (req.query.search || req.query.q) as string;

    if (status) {
      status = mapStatusToBackend(status);
    }

    const result = await clientService.getClients({
      page,
      limit,
      name,
      phone,
      company,
      projectId,
      status: status as ClientStatus,
      search,
    });

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const createClientsBulk = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const clients = z.array(createClientSchema).parse(req.body);
    const result = await clientService.createClientsBulk(clients);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};
