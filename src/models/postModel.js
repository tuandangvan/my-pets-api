import mongoose, { Schema } from "mongoose";
import { enumStatus } from "~/enums/enum";

const postSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    reaction: [{
        type: Schema.Types.ObjectId,
        ref: "Users",
        unique: true
    }],
    images: [{
      type: String
    }],
    comments: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        userId: {
          type: Schema.Types.ObjectId,
          ref: "Users"
        },
        content: {
            type: String,
            required: true
        },
        createAt:{
            type: Date,
            default: Date.now()
        }
      }
    ],
    status:{
        type: String,
        enum: enumStatus.statusPost,
        default: enumStatus.statusPost.ACTIVE
    }
  },
  {
    timestamps: true
  }
);

const postModel = mongoose.model("Posts", postSchema);
export default postModel;
