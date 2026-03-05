import { Request, Response, NextFunction } from "express";
import {
  AuthService,
  registerSchema,
  loginSchema,
  verifySchema,
} from "../services/auth.service";
import { successResponse, errorResponse } from "../utils/response";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = registerSchema.parse(req.body);
    const result = await AuthService.register(data);
    successResponse(res, result, 201);
  } catch (error) {
    next(error);
  }
};

export const verify = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = verifySchema.parse(req.body);
    const result = await AuthService.verify(data.phone, data.code);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = loginSchema.parse(req.body);
    const result = await AuthService.login(data);
    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      return errorResponse(res, "Не авторизован", 401);
    }
    const user = await AuthService.me(req.user.userId);
    successResponse(res, user);
  } catch (error) {
    next(error);
  }
};
