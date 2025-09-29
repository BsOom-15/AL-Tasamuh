import mongoose from "mongoose";

const MemoryItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, enum: ["artist", "artwork", "exhibition", "card"], required: true },
  image: { type: String, default: "/default-image.jpg" },
  description: { type: String },
  category: { type: String, enum: ["summer", "winter", "autumn", "spring"], default: "summer" }, // ← الكاتيجوري
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist" }, // ← الربط مع الفنان
  exhibition: { type: mongoose.Schema.Types.ObjectId, ref: "Exhibition" }, // ← الربط مع المعرض
  available: { type: Boolean, default: true },
  year: { type: String },
  medium: { type: String },
  dimensions: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("MemoryItem", MemoryItemSchema);
