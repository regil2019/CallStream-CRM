import { Router } from "express";
import * as callController from "../controllers/call.controller";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, callController.createCallLog);
router.get("/", authenticate, callController.getCallLogs);

export default router;
