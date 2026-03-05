import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { errorResponse } from "../utils/response";
import logger from "../utils/logger";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  if (err instanceof ZodError) {
    return errorResponse(
      res,
      "Ошибка валидации",
      400,
      err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        return errorResponse(res, "Нарушено ограничение уникальности", 409, {
          target: err.meta?.target,
        });
      case "P2025":
        return errorResponse(res, "Запись не найдена", 404);
      default:
        return errorResponse(res, "Ошибка базы данных", 500);
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return errorResponse(res, "Ошибка валидации данных базы", 400);
  }

  if (err instanceof TokenExpiredError) {
    return errorResponse(res, "Срок действия токена истёк", 401);
  }

  if (err instanceof JsonWebTokenError) {
    return errorResponse(res, "Недействительный токен", 401);
  }

  if (err.code === "LIMIT_FILE_SIZE") {
    return errorResponse(res, "Файл слишком большой", 400);
  }

  if (err instanceof SyntaxError && "body" in err) {
    return errorResponse(res, "Некорректный JSON формат", 400);
  }

  const statusCode =
    err.statusCode >= 400 && err.statusCode <= 599 ? err.statusCode : 500;

  const message =
    statusCode === 500 ? "Внутренняя ошибка сервера" : err.message || "Ошибка";

  return errorResponse(res, message, statusCode, (err as any).details);
};
