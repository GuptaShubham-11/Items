import mongoose, { Schema } from "mongoose";


const itemSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    coverImage: {
        type: String,
        required: true
    },
    additionalImages: {
        type: [String],
    },
});

const Item = mongoose.model("Item", itemSchema);
export default Item;