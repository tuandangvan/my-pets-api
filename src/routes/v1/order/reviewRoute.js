import express from "express";
import authencation from "../../../middlewares/authencationHandingMiddleware.js";
import { authorizationMiddelware } from "../../../middlewares/authorizationHandlingMiddelware.js";
import PermissionRoles from "../../../utils/rolePermission.js";
import { reviewController } from "../../../controllers/order/reviewController.js";

const router = express.Router();
router.post(
    "/",
    authencation,
    authorizationMiddelware.permission(PermissionRoles.onlyUser),
    reviewController.createReview
);

router.get(
    "/:petId",
    authencation,
    authorizationMiddelware.permission(PermissionRoles.All),
    reviewController.getOneReview
);

router.get(
    "/all/:centerId",
    authencation,
    authorizationMiddelware.permission(PermissionRoles.All),
    reviewController.getAllReviewBySeller
);


export const reviewRoute = router;
