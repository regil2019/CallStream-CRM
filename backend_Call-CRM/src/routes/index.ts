import { Router } from "express";
import authRoutes from "./auth.routes";
import projectRoutes from "./project.routes";
import callRoutes from "./call.routes";
import uploadRoutes from "./upload.routes";
import clientRoutes from "./client.routes";
import statsRoutes from "./stats.routes";
import saleScriptRoutes from "./saleScript.routes";
import objectionTemplateRoutes from "./objectionTemplate.routes";
import { authenticate } from "../middlewares/auth";
import prisma from "../utils/prisma";
import { uploadQueue } from "../services/queue.service";

const router: Router = Router();

// Public
router.get("/health", async (req, res) => {
  const status: any = {
    api: "ok",
    database: "unknown",
    redis: "unknown",
  };

  try {
    await (prisma as any).$queryRaw`SELECT 1`;
    status.database = "ok";
  } catch (e) {
    status.database = "error";
  }

  try {
    const connection = (uploadQueue as any).client;
    if (connection) {
      status.redis = "ok";
    } else {
      status.redis = "error";
    }
  } catch (e) {
    status.redis = "error";
  }

  res.json(status);
});

router.use("/auth", authRoutes);

// Protected
router.use("/projects", authenticate, projectRoutes);
router.use("/calls", authenticate, callRoutes);
router.use("/uploads", authenticate, uploadRoutes);
router.use("/clients", authenticate, clientRoutes);
router.use("/stats", authenticate, statsRoutes);
router.use("/scripts", authenticate, saleScriptRoutes);
router.use("/templates", authenticate, objectionTemplateRoutes);

export default router;
