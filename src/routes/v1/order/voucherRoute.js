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

router.get(
  "/center/:centerId",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.All),
  voucherController.findVoucherCenter
);

router.delete(
  "/:id",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyCenter),
  voucherController.deleteVoucher
);

export const voucherRoute = router;
