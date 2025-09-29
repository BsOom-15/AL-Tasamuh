// controllers/memoryItemController.js
import MemoryItem from "../models/MemoryItem.js";
import mongoose from "mongoose";

// ✅ Create MemoryItem
export const createMemoryItem = async (req, res) => {
  try {
    const { title, type, category, year, medium, dimensions, available, artist, exhibition } = req.body;

    if (!title || !type) {
      return res.status(400).json({ success: false, message: "title and type are required" });
    }

    const newItem = new MemoryItem({
      title,
      type,
      category,
      year,
      medium,
      dimensions,
      available: status === "true" || status === true,
      artist: artist ? new mongoose.Types.ObjectId(artist) : undefined,
      exhibition: exhibition ? new mongoose.Types.ObjectId(exhibition) : undefined,
      // ✅ خزن الصورة بالمسار الصحيح
      image: req.file ? `/uploads/${req.file.filename}` : undefined,
    });

    const savedItem = await newItem.save();
    res.status(201).json({ success: true, data: savedItem });
  } catch (err) {
    console.error("❌ Create Error:", err);
    res.status(400).json({ success: false, message: "Error creating memory item", error: err.message });
  }
};


// ✅ Update MemoryItem
export const updateMemoryItem = async (req, res) => {
  try {
    const { title, type, category, year, medium, dimensions, available, artist, exhibition } = req.body;

    if (!title || !type) {
      return res.status(400).json({ success: false, message: "title and type are required" });
    }

    const updateData = {
      title,
      type,
      category,
      year,
      medium,
      dimensions,
      available: status === "true" || status === true,
      artist: artist ? new mongoose.Types.ObjectId(artist) : undefined,
      exhibition: exhibition ? new mongoose.Types.ObjectId(exhibition) : undefined,
    };

    // ✅ نفس الشي للـ update
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const updatedItem = await MemoryItem.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) return res.status(404).json({ success: false, message: "Memory item not found" });

    res.json({ success: true, data: updatedItem });
  } catch (err) {
    console.error("❌ Update Error:", err);
    res.status(400).json({ success: false, message: "Error updating memory item", error: err.message });
  }
};

// ✅ Read All MemoryItems (with optional filters)
export const getMemoryItems = async (req, res) => {
  try {
    const { type, category } = req.query;
    const query = {};
    if (type) query.type = type;
    if (category) query.category = category;

    const items = await MemoryItem.find(query)
      .populate("artist")
      .populate("exhibition")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: items });
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ success: false, message: "Error fetching memory items", error: err.message });
  }
};

// ✅ Read One MemoryItem by ID
export const getMemoryItemById = async (req, res) => {
  try {
    const item = await MemoryItem.findById(req.params.id)
      .populate("artist")
      .populate("exhibition");

    if (!item) return res.status(404).json({ success: false, message: "Memory item not found" });

    res.json({ success: true, data: item });
  } catch (err) {
    console.error("❌ Fetch One Error:", err);
    res.status(500).json({ success: false, message: "Error fetching memory item", error: err.message });
  }
};

// ✅ Delete MemoryItem
export const deleteMemoryItem = async (req, res) => {
  try {
    const deletedItem = await MemoryItem.findByIdAndDelete(req.params.id);

    if (!deletedItem) return res.status(404).json({ success: false, message: "Memory item not found" });

    res.json({ success: true, message: "Memory item deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    res.status(500).json({ success: false, message: "Error deleting memory item", error: err.message });
  }
};
