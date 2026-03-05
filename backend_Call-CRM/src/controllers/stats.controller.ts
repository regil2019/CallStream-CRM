import { Request, Response, NextFunction } from "express";
import * as statsService from "../services/stats.service";
import { successResponse } from "../utils/response";

export const getCallStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const projectId = req.query.projectId as string;
    const userId = req.query.userId as string;
    const startDateString = req.query.startDate as string;
    const endDateString = req.query.endDate as string;

    const startDate = startDateString ? new Date(startDateString) : undefined;
    const endDate = endDateString ? new Date(endDateString) : undefined;

    const stats = await statsService.getCallStats({
      projectId,
      userId,
      startDate,
      endDate,
    });

    successResponse(res, stats);
  } catch (error) {
    next(error);
  }
};
