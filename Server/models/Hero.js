  import mongoose from "mongoose";

  const HeroSchema = new mongoose.Schema({
    title: { type: String, required: true },          
    description: { type: String, required: true },    
    image: { type: String, required: true },          
    exhibition: {                                     
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exhibition",
      required: true
    },
    createdAt: { type: Date, default: Date.now }
  });

  export default mongoose.model("Hero", HeroSchema);
