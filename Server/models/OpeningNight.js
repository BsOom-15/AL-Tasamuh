import mongoose from "mongoose";

const OpeningNightSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String }], // صور متعددة
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("OpeningNight", OpeningNightSchema);
