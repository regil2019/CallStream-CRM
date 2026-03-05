import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import * as templateService from "../services/objectionTemplate.service";
import { successResponse } from "../utils/response";

const templateSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен"),
  content: z.string().min(1, "Содержание обязательно"),
  type: z.string().optional(),
});

const updateTemplateSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  type: z.string().optional(),
});

export const createTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = templateSchema.parse(req.body);
    const template = await templateService.createTemplate(data);
    successResponse(res, template, 201);
  } catch (error) {
    next(error);
  }
};

export const getTemplates = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const templates = await templateService.getTemplates();
    successResponse(res, templates);
  } catch (error) {
    next(error);
  }
};

export const updateTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const data = updateTemplateSchema.parse(req.body);
    const template = await templateService.updateTemplate(id, data);
    successResponse(res, template);
  } catch (error) {
    if ((error as any).code === "P2025") {
      const notFoundError = new Error("Шаблон не найден");
      (notFoundError as any).statusCode = 404;
      return next(notFoundError);
    }
    next(error);
  }
};

export const deleteTemplate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    await templateService.deleteTemplate(id);
    successResponse(res, { message: "Шаблон успешно удален" });
  } catch (error) {
    if ((error as any).code === "P2025") {
      const notFoundError = new Error("Шаблон не найден");
      (notFoundError as any).statusCode = 404;
      return next(notFoundError);
    }
    next(error);
  }
};
