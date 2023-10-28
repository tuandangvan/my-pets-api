import express, { json } from "express";
import { StatusCodes } from "http-status-codes";
import { authController } from "~/controllers/authController";
import authencation from "~/middlewares/authencationHandingMiddleware";
import { authorizationMiddelware } from "~/middlewares/authorizationHandlingMiddelware";

const router = express.Router();
router.get(
  "/test",
  (req, res) => res.status(StatusCodes.OK),
  json({ message: "Get API success" })
);
router.post("/sign-up", authController.signUp);
router.post("/sign-in", authController.signIn);
router.post("/refresh-token", authController.refreshToken);
router.post("/send-code", authController.reSendEmailAuthencation);
router.post("/verify-code", authController.verifyOTP);
router.post("/forgot-password", authController.forgotPassword);
router.put("/change-password", authencation, authorizationMiddelware.permission(['USER', 'CENTER']), authController.changePassword);
router.post("/token", authController.checkExpireToken);
router.post("/sign-out", authController.signOut);
export const authRoute = router;
