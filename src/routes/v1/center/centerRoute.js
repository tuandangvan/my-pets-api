import express from "express";
import { centerController } from "~/controllers/center/centerController";


const router = express.Router();
router.post("/:accountId", centerController.createInfoForCenter);
router.post("/update", centerController.updateCenter);
export const centerRoute = router;
