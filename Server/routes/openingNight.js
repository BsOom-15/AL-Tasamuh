// backend/routes/openingNight.js
import express from "express";
import OpeningNight from "../models/OpeningNight.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Get Opening Nights (sampled)
router.get("/", async (req, res) => {
  try {
    const limit = Math.max(1, Number(req.query.limit) || 3);
    const sampled = await OpeningNight.aggregate([
      { $sample: { size: limit } },
      { $project: { _id: 1 } },
    ]);
    const ids = sampled.map((s) => s._id);
    const nights = await OpeningNight.find({ _id: { $in: ids } });
    const ordered = ids
      .map((id) => nights.find((n) => String(n._id) === String(id)))
      .filter(Boolean);
    res.status(200).json({ data: ordered });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ✅ Create
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => file.filename);
    const newOpeningNight = new OpeningNight({
      name: req.body.name,
      images: imagePaths,
    });
    await newOpeningNight.save();
    res.json(newOpeningNight);
  } catch (err) {
    res.status(400).json({ message: "Error creating Opening Night", error: err.message });
  }
});

// ✅ Update
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    const { id } = req.params;
    const night = await OpeningNight.findById(id);
    if (!night) return res.status(404).json({ message: "Not found" });

    // لو رفع صور جديدة → نضيفها
    let updatedImages = night.images;
    if (req.files && req.files.length > 0) {
      const newPaths = req.files.map((file) => file.filename);
      updatedImages = [...updatedImages, ...newPaths];
    }

    night.name = req.body.name || night.name;
    night.images = updatedImages;
    await night.save();

    res.json(night);
  } catch (err) {
    res.status(400).json({ message: "Error updating Opening Night", error: err.message });
  }
});

// ✅ Delete
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const night = await OpeningNight.findByIdAndDelete(id);
    if (!night) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Opening Night deleted" });
  } catch (err) {
    res.status(400).json({ message: "Error deleting Opening Night", error: err.message });
  }
});

export default router;
