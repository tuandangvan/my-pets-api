import express from "express";
import { centerController } from "~/controllers/center/centerController";
import authencation from "~/middlewares/authencationHandingMiddleware";
import { authorizationMiddelware } from "~/middlewares/authorizationHandlingMiddelware";
import PermissionRoles from "~/utils/rolePermission";


const router = express.Router();
router.post("/:accountId", centerController.createInfoForCenter);
router.put("/:centerId", authencation, authorizationMiddelware.permission(PermissionRoles.onlyCenter), 
centerController.updateCenter);
router.get("/:centerId", authencation, authorizationMiddelware.permission(PermissionRoles.All), 
centerController.getCenter);
export const centerRoute = router;
