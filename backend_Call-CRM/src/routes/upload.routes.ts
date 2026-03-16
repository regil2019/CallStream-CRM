import { Router } from "express";
import { uploadFile } from "../controllers/upload.controller";
import { upload } from "../middlewares/upload";

const router: Router = Router();

// @route   POST /api/v1/uploads
// @desc    Upload CSV/Excel file for processing
// @access  Protected
router.post("/", upload.single("file"), uploadFile);

export default router;
