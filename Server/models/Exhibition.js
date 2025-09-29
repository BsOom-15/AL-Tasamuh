// models/Exhibition.js
import mongoose from "mongoose";

const exhibitionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true }, // الفنان الرئيسي
    date: { type: String },
    overview: { type: String },
    description: { type: String },
    artists: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artist" }], // فنانين إضافيين
    works: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }], // الأعمال
    press: [{ type: String }],
    cover: { type: String }, // صورة الغلاف
  },
  { timestamps: true }
);

const Exhibition = mongoose.model("Exhibition", exhibitionSchema);
export default Exhibition;
