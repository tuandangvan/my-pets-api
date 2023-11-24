import express from "express";
import { chatController } from "../../../controllers/chat/chatController.js";
import authencation from "../../../middlewares/authencationHandingMiddleware.js";
import { authorizationMiddelware } from "../../../middlewares/authorizationHandlingMiddelware.js";
import PermissionRoles from "../../../utils/rolePermission.js";


const router = express.Router();
router.post("/:id",authencation, authorizationMiddelware.permission(PermissionRoles.User_Center), chatController.createChatBetweenTwoUsers);
router.get("",authencation, authorizationMiddelware.permission(PermissionRoles.User_Center), chatController.getChatsForUser);

export const chatRoute = router;
