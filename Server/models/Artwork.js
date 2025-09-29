import mongoose from "mongoose";

const artworkSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: "Artist", required: true },
    exhibition: { type: mongoose.Schema.Types.ObjectId, ref: "Exhibition" },
    status: { type: String, enum: ["active", "sold", "inactive"], default: "active" }
  },
  { timestamps: true }
);

const Artwork = mongoose.model("Artwork", artworkSchema);
export default Artwork;
