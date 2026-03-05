import { Request, Response, NextFunction } from "express";

const sanitize = (data: any): any => {
  if (typeof data === "string") {
    return data.trim().replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitize(item));
  }

  if (typeof data === "object" && data !== null) {
    const sanitizedData: any = {};
    for (const key in data) {
      sanitizedData[key] = sanitize(data[key]);
    }
    return sanitizedData;
  }

  return data;
};

export const sanitizeData = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  next();
};
