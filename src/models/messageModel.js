import mongoose, { Schema } from "mongoose";

const messageSchema = mongoose.Schema(
  {
    content: {
      type: String,
      require: true
    },
    sender: {
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
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat"
    },
    attachments: [
      {
        type: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        }
      }
    ],
    isRead: {
      type: Boolean,
      default: false
    }
  },

  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);
export default messageModel;
