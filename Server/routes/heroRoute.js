import express from "express";
import Hero from "../models/Hero.js";

const router = express.Router();

// إضافة سلايد جديدة
router.post("/", async (req, res) => {
  try {
    const { title, description, image, exhibition } = req.body;

    if (!exhibition) {
      return res.status(400).json({ message: "Exhibition is required" });
    }

    const hero = new Hero({
      title,
      description,
      image,
      exhibition,
    });

    await hero.save();
    res.status(201).json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// جلب كل سلايدات الهيرو
router.get("/", async (req, res) => {
  try {
    const heroes = await Hero.find().populate("exhibition", "title startDate endDate images");
    res.json(heroes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// تعديل سلايد
router.put("/:id", async (req, res) => {
  try {
    const hero = await Hero.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(hero);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// حذف سلايد
router.delete("/:id", async (req, res) => {
  try {
    await Hero.findByIdAndDelete(req.params.id);
    res.json({ message: "Hero item deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
