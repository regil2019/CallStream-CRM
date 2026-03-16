import { Router } from "express";
import * as saleScriptController from "../controllers/saleScript.controller";
import { authenticate } from "../middlewares/auth";

const router: Router = Router();

router.post("/", authenticate, saleScriptController.createScript);
router.get("/", authenticate, saleScriptController.getScripts);
router.patch("/:id", authenticate, saleScriptController.updateScript);
router.delete("/:id", authenticate, saleScriptController.deleteScript);

export default router;
