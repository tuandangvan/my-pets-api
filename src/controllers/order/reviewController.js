import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError";
import { reviewService } from "../../services/reviewService";
import { orderService } from "../../services/orderService";
import centerModel from "../../models/centerModel";
import reviewModel from "../../models/reviewModel";

const createReview = async (req, res, next) => {
    try {
        const data = req.body;
        const review = await reviewService.createReview(data);

        const center = await centerModel.findOne({ _id: data.seller.centerId });
        const reviews = await reviewModel.find({ "seller.centerId": data.seller.centerId });
        var totalReview = 0;
        var totalRating = 0;

        for (let j = 0; j < reviews.length; j++) {
            if (center.id == reviews[j].seller.centerId) {
                totalReview++;
                totalRating += reviews[j].rating;
            }
        }
        center.rating = Math.round((totalRating / totalReview) * 10) / 10;
        await centerModel.updateOne({ _id: center._id }, { rating: center.rating });

        if (review) {
            await orderService.rating(data.orderId);
            res.status(StatusCodes.CREATED).json({
                success: true,
                message: "Create review successfully!",
            });
        }
    } catch (error) {
        const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
        next(customError);
    }
};

const getOneReview = async (req, res, next) => {
    try {
        const reviews = await reviewService.getOneReviewByPetId(req.params.petId);
        res.status(StatusCodes.OK).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
        next(customError);
    }
};

const getAllReviewBySeller = async (req, res, next) => {
    try {
        const reviews = await reviewService.getAllReviewBySeller('C', req.params.centerId);
        res.status(StatusCodes.OK).json({
            success: true,
            data: reviews,
        });
    } catch (error) {
        const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
        next(customError);
    }
};

const replyReview = async (req, res, next) => {
    try {
        const reviewId = req.params.reviewId;
        const reply = req.body.reply;
        await reviewService.replyReview(reviewId, reply);
        res.status(StatusCodes.OK).json({
            success: true,
            message: "Reply review successfully!",
        });
    } catch (error) {
        const customError = new ApiError(StatusCodes.UNAUTHORIZED, error.message);
        next(customError);
    }
};



export const reviewController = {
    createReview,
    getOneReview,
    getAllReviewBySeller,
    replyReview
};
