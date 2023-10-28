import express from "express";
import { userController } from "~/controllers/userController";
import { enums } from "~/enums/enums";
import authencation from "~/middlewares/authencationHandingMiddleware";
import { authorizationMiddelware } from "~/middlewares/authorizationHandlingMiddelware";


const router = express.Router();
router.get("/:accountId", userController.findUser);
router.post("/:accountId", userController.createInformation);
router.get("/get-all", userController.getAllUser);
router.post("/get-users", userController.findUserByNamePhoneEmail); //find user by name or phone or email
router.put("/:userId", authencation, authorizationMiddelware.permission(enums.roles.USER),
userController.changeInfomation); //find user by name or phone or email
router.put("/:userId", authencation, authorizationMiddelware.permission(enums.roles.USER),
userController.changeInfomation); //find user by name or phone or email

export const userRoute = router;
