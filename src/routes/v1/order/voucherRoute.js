import express from "express";
import authencation from "../../../middlewares/authencationHandingMiddleware.js";
import { authorizationMiddelware } from "../../../middlewares/authorizationHandlingMiddelware.js";
import PermissionRoles from "../../../utils/rolePermission.js";
import { voucherController } from "../../../controllers/order/voucherController.js";

const router = express.Router();
router.post(
  "/",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyCenter),
  voucherController.createVoucher
);
router.get(
  "/:centerId",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.All),
  voucherController.getVoucherOfCenter
);

router.get("/apply/:code", authencation, voucherController.applyVoucher);

export const voucherRoute = router;
