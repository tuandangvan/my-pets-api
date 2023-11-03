import mongoose, { Schema } from "mongoose";
import { enums } from "~/enums/enums";

const postSchema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        trim: true
    },
    avaiable: {
        type: Boolean,
        default: true, 
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    }],
},

    { timestamps: true }
);

const postModel = mongoose.model("Posts", postSchema);
export default postModel;
