import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as saleScriptService from "../services/saleScript.service";
import { successResponse } from "../utils/response";

const scriptSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен"),
  content: z.string().min(1, "Содержание обязательно"),
  category: z.string().optional(),
});

const updateScriptSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  category: z.string().optional(),
});

export const createScript = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = scriptSchema.parse(req.body);
    const script = await saleScriptService.createScript(data);
    successResponse(res, script, 201);
  } catch (error) {
    next(error);
  }
};

export const getScripts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const scripts = await saleScriptService.getScripts();
    successResponse(res, scripts);
  } catch (error) {
    next(error);
  }
};

export const updateScript = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = updateScriptSchema.parse(req.body);
    const script = await saleScriptService.updateScript(id, data);
    successResponse(res, script);
  } catch (error) {
    if ((error as any).code === "P2025") {
      const notFoundError = new Error("Скрипт не найден");
      (notFoundError as any).statusCode = 404;
      return next(notFoundError);
    }
    next(error);
  }
};

export const deleteScript = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await saleScriptService.deleteScript(id);
    successResponse(res, { message: "Скрипт успешно удален" });
  } catch (error) {
    if ((error as any).code === "P2025") {
      const notFoundError = new Error("Скрипт не найден");
      (notFoundError as any).statusCode = 404;
      return next(notFoundError);
    }
    next(error);
  }
};
