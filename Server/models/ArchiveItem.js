// Server/models/ArchiveItem.js
import mongoose from "mongoose";

const archiveSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String },
    price: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    sku: { type: String, index: true },
    stock: { type: Number, default: 0 },
    available: { type: Boolean, default: true },
    category: { type: String },
    archivedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("ArchiveItem", archiveSchema);
