import { StatusCodes } from "http-status-codes";
import ApiError from "../../utils/ApiError";
import { reviewService } from "../../services/reviewService";

const createReview = async (req, res, next) => {
    try {
        const data = req.body;
        await reviewService.createReview(data);

        res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Create review successfully!",
        });
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



export const reviewController = {
    createReview,
    getOneReview,
    getAllReviewBySeller
};
