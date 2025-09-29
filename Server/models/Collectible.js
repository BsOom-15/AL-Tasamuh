// Server/models/Collectible.js
import mongoose from "mongoose";

const collectibleSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String }, // full URL string
    price: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    sku: { type: String, index: true },
    stock: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    category: { type: String },
}, { timestamps: true });

export default mongoose.model("Collectible", collectibleSchema);
