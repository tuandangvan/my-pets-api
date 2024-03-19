import express from "express";
import authencation from "../../../middlewares/authencationHandingMiddleware.js";
import { authorizationMiddelware } from "../../../middlewares/authorizationHandlingMiddelware.js";
import PermissionRoles from "../../../utils/rolePermission.js";
import { orderController } from "../../../controllers/order/orderController.js";

const router = express.Router();
router.get(
  "/:orderId",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyUser),
  orderController.getPayment
);


export const paymentRoute = router;
