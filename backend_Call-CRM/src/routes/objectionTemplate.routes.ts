import { Router } from "express";
import * as templateController from "../controllers/objectionTemplate.controller";
import { authenticate } from "../middlewares/auth";

const router: Router = Router();

router.post("/", authenticate, templateController.createTemplate);
router.get("/", authenticate, templateController.getTemplates);
router.patch("/:id", authenticate, templateController.updateTemplate);
router.delete("/:id", authenticate, templateController.deleteTemplate);

export default router;
