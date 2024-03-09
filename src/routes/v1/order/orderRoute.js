import express from "express";
import authencation from "../../../middlewares/authencationHandingMiddleware.js";
import { authorizationMiddelware } from "../../../middlewares/authorizationHandlingMiddelware.js";
import PermissionRoles from "../../../utils/rolePermission.js";
import { orderController } from "../../../controllers/order/orderController.js";

const router = express.Router();
router.post(
  "/",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyUser),
  orderController.createOrder
);
router.get(
  "/seller",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.User_Center),
  orderController.getOrderBySeller
);

router.get(
  "/buyer",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.User_Center),
  orderController.getOrderBuyer
);

router.get(
  "/buyer/:orderId",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyUser),
  orderController.getOrderDetailByBuyer
);

router.get(
  "/seller/:orderId",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.User_Center),
  orderController.getOrderDetailBySeller
);

export const orderRoute = router;
