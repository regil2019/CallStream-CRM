import { Router } from "express";
import * as statsController from "../controllers/stats.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

// GET /api/v1/stats/calls
router.get("/calls", authenticate, statsController.getCallStats);

export default router;
