import express, { json } from "express";
import { authController } from "~/controllers/authController";
import authencation from "~/middlewares/authencationHandingMiddleware";
import { authorizationMiddelware } from "~/middlewares/authorizationHandlingMiddelware";
import PermissionRoles from "~/utils/rolePermission";

const router = express.Router();
router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/refresh-token", authencation, authController.refreshToken);
router.post("/send-code", authController.reSendEmailAuthencation);
router.post("/verify-code", authController.verifyOTP);
router.post("/forgot-password", authController.forgotPassword);
router.put("/change-password", authencation, authorizationMiddelware.permission(PermissionRoles.User_Center), authController.changePassword);
router.post("/token", authController.checkExpireToken);
router.post("/sign-out", authController.signOut);
export const authRoute = router;
