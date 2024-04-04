import mongoose from "mongoose";
import Review from "../models/reviewModel";

const createReview = async function (data) {
    const review = new Review({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });
    return review.save();
};

const getOneReviewByPetId = async function (petId) {
    const review = await Review.findOne({ petId: petId });

}

const getAllReviewBySeller = async function (type, id) {
    if (type == "C") {
        const review = await Review.find({ seller: { type: 'C', centerId: id, userId: null } });
        return review;
    } else {
        const review = await Review.find({ seller: { type: 'U', centerId: null, userId: id } });
        return review;
    }

}

export const reviewService = {
    createReview,
    getOneReviewByPetId,
    getAllReviewBySeller
};
