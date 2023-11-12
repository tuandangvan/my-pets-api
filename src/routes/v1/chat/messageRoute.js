import express from "express";
import { messageController } from "~/controllers/chat/messageController";
import authencation from "~/middlewares/authencationHandingMiddleware";
import { authorizationMiddelware } from "~/middlewares/authorizationHandlingMiddelware";
import PermissionRoles from "~/utils/rolePermission";

const router = express.Router();
router.post(
  "/:chatId",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.User_Center),
  messageController.createMessage
);
router.get(
  "/:chatId",
  authencation,
  authorizationMiddelware.permission(PermissionRoles.User_Center),
  messageController.getMessagesInChat
);
// router.get("",authencation, authorizationMiddelware.permission(PermissionRoles.User_Center), chatController.getChatsForUser);

export const messageRoute = router;
