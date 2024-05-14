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
    const review = await Review.findOne({ petId: petId })
        .populate("seller.centerId", "id name avatar")
        .populate("buyer", "id firstName lastName avatar")
        .populate("petId", "id namePet petType breed weight birthday color price images");
    return review;

}

const getAllReviewBySeller = async function (type, id) {
    if (type == "C") {
        const review = await Review.find({ "seller.centerId": id })
            .populate("seller.centerId", "id name avatar")
            .populate("buyer", "id firstName lastName avatar")
            .populate("petId", "id namePet petType breed weight birthday color price images");
        return review;
    } else {
        const review = await Review.find({ "seller.userId": id })
            .populate("seller.centerId", "id name avatar")
            .populate("buyer", "id firstName lastName avatar")
            .populate("petId", "id namePet petType breed weight birthday color price images");
        return review;
    }

}

const replyReview = async function (reviewId, reply) {
    const review = await Review.updateOne({ _id: reviewId }, { reply: reply, dateReply: Date.now() });
    return review;
}



export const reviewService = {
    createReview,
    getOneReviewByPetId,
    getAllReviewBySeller,
    replyReview
};
