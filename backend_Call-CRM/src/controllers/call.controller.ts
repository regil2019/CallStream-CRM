import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as callService from "../services/call.service";
import { successResponse } from "../utils/response";

const createCallSchema = z.object({
  clientId: z.string().uuid("Некорректный ID клиента"),
  projectId: z.string().uuid().optional().nullable(),
  status: z.string().min(1, "Статус обязателен"),
  result: z.string().optional().nullable(),
  duration: z.number().optional().nullable(),
});

export const createCallLog = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const body = createCallSchema.parse(req.body);
    const userId = req.user?.userId;

    if (!userId) {
      const error = new Error("Пользователь не авторизован");
      (error as any).statusCode = 401;
      throw error;
    }

    const call = await callService.createCallLog({
      status: body.status,
      result: body.result,
      duration: body.duration,
      client: { connect: { id: body.clientId } },
      project: body.projectId ? { connect: { id: body.projectId } } : undefined,
      user: { connect: { id: userId } },
    });

    successResponse(res, call, 201);
  } catch (error) {
    next(error);
  }
};

export const getCallLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const userId = req.query.userId as string;
    const clientId = req.query.clientId as string;
    const projectId = req.query.projectId as string;
    const status = req.query.status as string;

    const result = await callService.getCallLogs({
      page,
      limit,
      userId,
      clientId,
      projectId,
      status,
    });

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};
