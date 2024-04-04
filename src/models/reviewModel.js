import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        buyer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        seller: {
            type: {
                type: String,
                enum: ["U", "C"],
                required: true
            },
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },
            centerId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Center",
                default: null
            }
        },
        petId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Pet",
            required: true
        },
        rating: {
            type: Number,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        images: [
            {
                type: String
            }
        ],
        video: {
            type: String
        },

    },
    {
        timestamps: true
    }
);

const reviewModel = mongoose.model("Review", reviewSchema);
export default reviewModel;
