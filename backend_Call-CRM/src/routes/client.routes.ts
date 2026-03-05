import { Router } from "express";
import * as clientController from "../controllers/client.controller";
import * as clientUploadController from "../controllers/clientUpload.controller";
import { upload } from "../middlewares/upload";

const router = Router();

router.post("/", clientController.createClient);
router.post(
  "/upload",
  upload.single("file"),
  clientUploadController.uploadClients,
);
router.get("/:id", clientController.getClientById);
router.patch("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);
router.post("/bulk", clientController.createClientsBulk);
router.get("/", clientController.getClients);

export default router;
