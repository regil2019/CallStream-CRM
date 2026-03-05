import app from "./app";
import prisma from "./utils/prisma";
import { startWorkers } from "./workers/index";
import logger from "./utils/logger";

const PORT = process.env.PORT || 3001;

const start = async () => {
  try {
    await prisma.$connect();
    logger.info("✔ Database connected successfully");

    startWorkers();

    app.listen(PORT, () => {
      logger.info(`✔ Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error("❌Failed to start server:", error);
    process.exit(1);
  }
};

start();
