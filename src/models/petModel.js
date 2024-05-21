import mongoose, { Schema } from "mongoose";
import { enums } from "../enums/enums.js";

const petSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    centerId: {
      type: Schema.Types.ObjectId,
      ref: "Center",
      default: null
    },
    namePet: {
      type: String,
      required: true,
      trim: true
    },
    petType: {
      type: String,
      default: "Chưa cập nhật"
    },
    breed: {
      type: String,
      default: "Chưa cập nhật"
    },
    gender: {
      type: String,
      enum: [enums.genders.MALE, enums.genders.FEMALE],
      require: true
    },
    age: {
      type: String,
      default: 1.0
    },
    weight: {
      type: String
    },
    birthday: {
      type: Date,
      default: null
    },
    color: [
      {
        type: String
      }
    ],
    price: {
      type: String,
      default: "0"
    },
    free: {
      type: Boolean,
      default: false
    },
    reducePrice: {
      type: Number,
      default: 0
    },
    dateStartReduce: {
      type: Date,
      default: null
    },
    dateEndReduce: {
      type: Date,
      default: null
    },
    images: [
      {
        type: String,
        default: "Chưa cập nhật"
      }
    ],
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    view: {
      type: Number,
      default: 0
    },
    original: {
      type: String,
      default: "Chưa cập nhật"
    },
    instruction: {
      type: String,
      default: "Chưa cập nhật"
    },
    attention: {
      type: String,
      default: "Chưa cập nhật"
    },
    hobbies: {
      type: String,
      default: "Chưa cập nhật"
    },
    inoculation: {
      type: String,
      default: "Chưa cập nhật"
    },
    statusPaid: {
      type: String,
      enums: ["PENDING", "PAID", "NOTHING"],
      default: "NOTHING"
    },
  },
  {
    timestamps: true
  }
);

const petModel = mongoose.model("Pet", petSchema);
export default petModel;
