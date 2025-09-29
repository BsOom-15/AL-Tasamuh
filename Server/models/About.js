import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: [{ type: String }]
});

const founderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }
});

const aboutSchema = new mongoose.Schema({
  header: {
    title: String,
    subtitle: String,
    introText: String
  },
  sections: [
    {
      title: String,
      content: String
    }
  ],
  galleries: [gallerySchema],
  founders: [founderSchema],
  quote: {
    text: String,
    author: String,
    backgroundImage: String
  }
}, { timestamps: true });

export default mongoose.model("About", aboutSchema);
