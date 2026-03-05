import { Request, Response, NextFunction } from "express";
import { addUploadJob } from "../services/queue.service";
import { successResponse, errorResponse } from "../utils/response";
import path from "path";

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.file) {
      return errorResponse(res, "No file uploaded", 400);
    }

    // Assuming backend runs where it can access uploads/
    // Since we use queue, we pass absolute path or relative from worker perspective.
    const filePath = path.resolve(req.file.path);

    const projectId = req.body.projectId;
    if (!projectId) {
      return errorResponse(res, "Project ID is required", 400);
    }

    const job = await addUploadJob(filePath, projectId);

    successResponse(
      res,
      {
        message: "File queued for processing",
        jobId: job.id,
        filename: req.file.filename,
      },
      202,
    );
  } catch (error) {
    next(error);
  }
};
