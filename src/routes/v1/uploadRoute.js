import express from "express";
import { uploadController } from "~/controllers/uploadController";
import authencation from "~/middlewares/authencationHandingMiddleware";
import { authorizationMiddelware } from "~/middlewares/authorizationHandlingMiddelware";
import fileImage from "~/upload/uploadCloudinary"
import PermissionRoles from "~/utils/rolePermission";


const router = express.Router();
router.post("/single", authencation, authorizationMiddelware.permission(PermissionRoles.All), fileImage.single('file') , uploadController.uploadSingle);
router.post("/multi-image", authencation, authorizationMiddelware.permission(PermissionRoles.onlyCenter), fileImage.array('file', 5) , uploadController.uploadMulti);

export const uploadRoute = router;
