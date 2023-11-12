import express from "express";
import { chatController } from "~/controllers/chat/chatController";
import authencation from "~/middlewares/authencationHandingMiddleware";
import { authorizationMiddelware } from "~/middlewares/authorizationHandlingMiddelware";
import PermissionRoles from "~/utils/rolePermission";


const router = express.Router();
router.post("/:id",authencation, authorizationMiddelware.permission(PermissionRoles.User_Center), chatController.createChatBetweenTwoUsers);
router.get("",authencation, authorizationMiddelware.permission(PermissionRoles.User_Center), chatController.getChatsForUser);

export const chatRoute = router;
