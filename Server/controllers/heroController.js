// controllers/heroController.js
import Hero from "../models/Hero.js";
import fs from "fs";

// إضافة Banner
export const createHero = async (req, res) => {
  try {
    const hero = new Hero({
      ...req.body,
      image: req.file ? req.file.path : null,
    });
    await hero.save();
    res.status(201).json(hero);
  } catch (error) {
    res.status(500).json({ message: "Error creating hero", error: error.message });
  }
};

// جلب كل Banners
export const getHeroes = async (req, res) => {
  try {
    const heroes = await Hero.find().sort({ order: 1 });
    res.status(200).json(heroes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching heroes", error: error.message });
  }
};

// تعديل Banner
export const updateHero = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.path;

    const updated = await Hero.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Hero not found" });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating hero", error: error.message });
  }
};

// حذف Banner
export const deleteHero = async (req, res) => {
  try {
    const hero = await Hero.findByIdAndDelete(req.params.id);
    if (!hero) return res.status(404).json({ message: "Hero not found" });

    if (hero.image && fs.existsSync(hero.image)) fs.unlinkSync(hero.image);
    res.status(200).json({ message: "Hero deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting hero", error: error.message });
  }
};
