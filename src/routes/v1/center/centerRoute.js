import express from "express";
import { centerController } from "../../../controllers/center/centerController.js";
import authencation from "../../../middlewares/authencationHandingMiddleware.js";
import { authorizationMiddelware } from "../../../middlewares/authorizationHandlingMiddelware.js";
import PermissionRoles from "../../../utils/rolePermission.js";


const router = express.Router();
router.post("/:accountId", centerController.createInfoForCenter);
router.put("/:centerId", authencation, authorizationMiddelware.permission(PermissionRoles.onlyCenter), 
centerController.updateCenter);
router.get("/:centerId", centerController.getCenter);

router.put("/:centerId/status", authencation, authorizationMiddelware.permission(PermissionRoles.onlyUser),
centerController.changStatusAccount);

router.get("/hot/list", centerController.getCenterHot);
export const centerRoute = router;
