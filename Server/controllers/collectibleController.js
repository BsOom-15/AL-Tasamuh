// Server/controllers/collectibleController.js
import Collectible from "../models/Collectible.js";

// 📌 Get all collectibles
export const getCollectibles = async (req, res) => {
  try {
    const collectibles = await Collectible.find();
    res.json(collectibles);
  } catch (err) {
    res.status(500).json({ message: "Error fetching collectibles", error: err.message });
  }
};

// 📌 Get collectible by ID
export const getCollectibleById = async (req, res) => {
  try {
    const collectible = await Collectible.findById(req.params.id);
    if (!collectible) return res.status(404).json({ message: "Not found" });
    res.json(collectible);
  } catch (err) {
    res.status(500).json({ message: "Error fetching collectible", error: err.message });
  }
};

// 📌 Create collectible
export const createCollectible = async (req, res) => {
  try {
    const { title, description, price, currency } = req.body;
    const collectible = new Collectible({
      title,
      description,
      price: price || 0,
      currency: currency || "",
      image: req.file
        ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
        : null
    });
    await collectible.save();
    res.status(201).json(collectible);
  } catch (err) {
    res.status(400).json({ message: "Error creating collectible", error: err.message });
  }
};

// 📌 Update collectible
export const updateCollectible = async (req, res) => {
  try {
    const { title, description, price, currency } = req.body;
    const collectible = await Collectible.findById(req.params.id);
    if (!collectible) return res.status(404).json({ message: "Not found" });

    collectible.title = title || collectible.title;
    collectible.description = description || collectible.description;
    collectible.price = price !== undefined ? price : collectible.price;
    collectible.currency = currency !== undefined ? currency : collectible.currency;
    if (req.file) {
      collectible.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    await collectible.save();
    res.json(collectible);
  } catch (err) {
    res.status(400).json({ message: "Error updating collectible", error: err.message });
  }
};

// 📌 Delete collectible
export const deleteCollectible = async (req, res) => {
  try {
    const collectible = await Collectible.findById(req.params.id);
    if (!collectible) return res.status(404).json({ message: "Not found" });

    await collectible.deleteOne();
    res.json({ message: "Collectible deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting collectible", error: err.message });
  }
};
