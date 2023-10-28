import express from "express";
import { adminController } from "~/controllers/admin/adminController";
import authencation from "~/middlewares/authencationHandingMiddleware";
import { authorizationMiddelware } from "~/middlewares/authorizationHandlingMiddelware";
import PermissionRoles from "~/utils/rolePermission";


const router = express.Router();
router.get("/users", authencation, authorizationMiddelware.permission(PermissionRoles.onlyAdmin),
adminController.getAllUser);

router.get("/pets", authencation, authorizationMiddelware.permission(PermissionRoles.onlyAdmin),
adminController.getAllPets);

export const adminRoute = router;
