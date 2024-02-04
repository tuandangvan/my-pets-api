import mongoose, { Schema } from "mongoose";

const chatSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
      type: String,
      trim: true
    },
    avaiable: {
      type: Boolean,
      default: true
    },
    participants: [
      {
        _id: {
          type: Schema.Types.ObjectId,
          auto: false
        },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          default: null
        },
        centerId: {
          type: Schema.Types.ObjectId,
          ref: "Center",
          default: null
        }
      }
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Message"
      }
    ]
  },

  { timestamps: true }
);

const chatModel = mongoose.model("Chat", chatSchema);
export default chatModel;
