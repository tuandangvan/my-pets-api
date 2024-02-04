import express from "express";
import { adminController } from "../../../controllers/admin/adminController.js";
import authencation from "../../../middlewares/authencationHandingMiddleware.js";
import { authorizationMiddelware } from "../../../middlewares/authorizationHandlingMiddelware.js";
import PermissionRoles from "../../../utils/rolePermission.js";

const router = express.Router();
router.get(
  "/users",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyAdmin),
  adminController.getAllUser
);
router.get(
  "/centers",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyAdmin),
  adminController.getAllCenter
);

router.get(
  "/pets",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyAdmin),
  adminController.getAllPets
);
router.put(
  "/account/status",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyAdmin),
  adminController.lockAndUnLockAcc
);

router.get(
  "/report",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyAdmin),
  adminController.getReport
);

router.put(
  "/report/handle",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyAdmin),
  adminController.handleReport
);

router.get(
  "/post/:postId",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.onlyAdmin),
  adminController.getPostByAdmin
);

export const adminRoute = router;
