import { Queue } from "bullmq";

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  password: process.env.REDIS_PASSWORD,
  tls: process.env.REDIS_TLS === "true" ? {} : undefined,
  maxRetriesPerRequest: null,
};

export const uploadQueue = new Queue("uploads", { connection });

/**
 * Add a file upload processing job to the queue.
 * @param filePath - absolute path to the uploaded file
 * @param projectId - project ID the file belongs to
 */
export const addUploadJob = async (filePath: string, projectId: string) => {
  return await uploadQueue.add("process-file", { filePath, projectId });
};

export const addClientUploadJob = async (filePath: string) => {
  return await uploadQueue.add("process-clients", { filePath });
};
