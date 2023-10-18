import mongoose, { Schema } from "mongoose";

const petSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      required: true
    },
    namePet: {
      type: String,
      required: true,
      trim: true
    },
    species: {
      type: String,
      default: "Chưa cập nhật"
    },
    breed: {
      type: String,
      default: "Chưa cập nhật"
    },
    gender: {
      type: String,
      enum: ["male", "female"],
      require: true
    },
    color: {
        type: String,
        required: true,
        default: "Chưa cập nhật"
    },
    description: {
      type: String,
      default: "Chưa cập nhật"
    },
    images: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        image: {
          data: Buffer,
          contentType: String
        }
      }
    ],
    healthInfo: {
      type: String,
      default: "Chưa cập nhật"
    },
    level: {
      type: String,
      required: true,
      enum: ["Bình thường", "Khẩn cấp"],
      default: "Bình thường"
    },
    foundOwner: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  {
    timestamps: true
  }
);

const petModel = mongoose.model("Pet", petSchema);
export default petModel;
