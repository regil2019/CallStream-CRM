import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "../utils/response";

interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return errorResponse(res, "Доступ запрещён: токен не предоставлен", 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    return errorResponse(res, "Доступ запрещён: недействительный токен", 401);
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, "Не авторизован", 401);
    }
    if (roles.indexOf(req.user.role) === -1) {
      return errorResponse(res, "Запрещено: недостаточно прав", 403);
    }
    next();
  };
};
