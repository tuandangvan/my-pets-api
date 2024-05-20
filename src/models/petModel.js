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
    giver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    rescue: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    linkCenter: {
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
    images: [
      {
        type: String,
        default: "Chưa cập nhật"
      }
    ],
    // healthInfo: {
    //   type: String,
    //   default: "Chưa cập nhật"
    // },
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
    foundOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    statusAdopt: {
      type: String,
      required: true,
      enum: [
        enums.statusAdopt.NOTHING,
        enums.statusAdopt.ADOPTING,
        enums.statusAdopt.HAS_ONE_OWNER
      ],
      default: enums.statusAdopt.NOTHING
    },
    adoptBy: {
      type: String,
      required: true,
      enum: ["CENTER", "USER"]
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
