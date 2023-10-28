import express from "express";
import { uploadController } from "~/controllers/uploadController";
import fileImage from "~/upload/uploadCloudinary"


const router = express.Router();
router.post("/single", fileImage.single('file') , uploadController.uploadSingle);
router.post("/multi-image", fileImage.array('file', 5) , uploadController.uploadMulti);

export const uploadRoute = router;
