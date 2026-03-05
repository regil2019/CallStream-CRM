import { uploadWorker } from "./upload.worker";
import { Job } from "bullmq";

export const startWorkers = () => {
  uploadWorker.on("completed", (job: Job) => {
    console.log(`Job ${job.id} completed!`);
  });

  uploadWorker.on("failed", (job: Job | undefined, err: Error) => {
    console.error(`Job ${job?.id} failed with error ${err.message}`);
  });

  console.log("Workers started");
};
