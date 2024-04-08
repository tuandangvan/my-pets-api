import express from "express";
import authencation from "../../middlewares/authencationHandingMiddleware";
import PermissionRoles from "../../utils/rolePermission";
import { statisticalController } from "../../controllers/statisticalController";
import { authorizationMiddelware } from "../../middlewares/authorizationHandlingMiddelware";

const router = express.Router();
router.get("/year", authencation, authorizationMiddelware.permission(PermissionRoles.onlyCenter), statisticalController.statisticalYear);

export const statisticalRoute = router;