import express from "express";
import { postController } from "~/controllers/postController";
import authencation from "~/middlewares/authencationHandingMiddleware";
import { authorizationMiddelware } from "~/middlewares/authorizationHandlingMiddelware";
import PermissionRoles from "~/utils/rolePermission";


const router = express.Router();
router.post("/", authencation, authorizationMiddelware.permission(PermissionRoles.User_Center), postController.addPost);
router.put("/:postId", authencation, authorizationMiddelware.permission(PermissionRoles.User_Center), postController.addPost);
router.delete("/:postId", authencation, authorizationMiddelware.permission(PermissionRoles.User_Center), postController.addPost);
router.post("/comment/:id", postController.postComment);
router.post("/comment/:id/:commentId", postController.deleteComment);
router.post("/reaction/:id", postController.addReaction);
router.post("/status-change/:id", postController.changeStatusPost);
router.get("/:id", postController.getPost);
router.get("/comment/:id", postController.getComment);
router.get("/reaction/:id", postController.getReaction);


export const postRoute = router;
