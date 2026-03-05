import { Request, Response, NextFunction } from "express";
import path from "path";
import { addClientUploadJob, uploadQueue } from "../services/queue.service";
import { successResponse, errorResponse } from "../utils/response";
import { Job, QueueEvents } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
};

const queueEvents = new QueueEvents("uploads", { connection });

export const uploadClients = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return errorResponse(res, "Файл не загружен", 400);
    }

    const filePath = path.resolve(req.file.path);

    const job = await addClientUploadJob(filePath);

    const result = await job.waitUntilFinished(queueEvents);

    successResponse(res, result);
  } catch (error) {
    next(error);
  }
};
