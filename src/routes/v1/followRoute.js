import express from "express";
import authencation from "../../middlewares/authencationHandingMiddleware.js";
import { authorizationMiddelware } from "../../middlewares/authorizationHandlingMiddelware.js";
import PermissionRoles from "../../utils/rolePermission.js";
import { followController } from "../../controllers/followController.js";


const router = express.Router();

router.post("", authencation, authorizationMiddelware.permission(PermissionRoles.All), followController.follow);
router.get("/center", authencation, authorizationMiddelware.permission(PermissionRoles.All), followController.getMyFollowCenter);
router.get("/follower/:id", authencation, authorizationMiddelware.permission(PermissionRoles.All), followController.getFollower);
router.get("/following/:id", authencation, authorizationMiddelware.permission(PermissionRoles.All), followController.getFollowing);

export const followRote = router;