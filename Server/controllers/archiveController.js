// Server/controllers/archiveController.js
import ArchiveItem from "../models/ArchiveItem.js";
import fs from "fs";
import path from "path";

export const getArchiveItems = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 12);
    const skip = (page - 1) * limit;

    const [total, items] = await Promise.all([
      ArchiveItem.countDocuments(),
      ArchiveItem.find()
        .sort({ archivedAt: -1 })
        .skip(skip)
        .limit(limit),
    ]);

    res.json({ data: items, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: "Error fetching archive", error: err.message });
  }
};

export const getArchiveItemById = async (req, res) => {
  try {
    const item = await ArchiveItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error", error: err.message });
  }
};

export const createArchiveItem = async (req, res) => {
  try {
    const body = req.body;
    const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : null;
    const newItem = new ArchiveItem({ ...body, image, archivedAt: new Date() });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: "Create failed", error: err.message });
  }
};

export const updateArchiveItem = async (req, res) => {
  try {
    const item = await ArchiveItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // حذف الصورة القديمة لو تم رفع صورة جديدة
    if (req.file && item.image) {
      try {
        const pathname = new URL(item.image).pathname;
        const filepath = path.join(process.cwd(), pathname);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      } catch (e) { /* ignore */ }
    }

    const image = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : item.image;
    const updated = await ArchiveItem.findByIdAndUpdate(req.params.id, { ...req.body, image }, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Update failed", error: err.message });
  }
};

export const deleteArchiveItem = async (req, res) => {
  try {
    const item = await ArchiveItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    if (item.image) {
      try {
        const pathname = new URL(item.image).pathname;
        const filepath = path.join(process.cwd(), pathname);
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
      } catch (e) {}
    }
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
