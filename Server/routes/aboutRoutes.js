import express from "express";
import About from "../models/About.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ✅ Get About Page
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Upload Founder Image
router.post("/upload-founder-image", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image uploaded" });
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});




// ✅ Create About Page
router.post("/", async (req, res) => {
  try {
    const about = new About(req.body);
    await about.save();
    res.status(201).json(about);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Update About Page
router.put("/:id", async (req, res) => {
  try {
    const about = await About.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(about);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
