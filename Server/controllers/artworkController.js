import Artwork from "../models/Artwork.js";
import Artist from "../models/Artist.js";
import Exhibition from "../models/Exhibition.js";
import fs from "fs";
import path from "path";

// 🔹 إضافة عمل فني جديد
export const createArtwork = async (req, res) => {
  try {
    const imagePath = req.file
      ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
      : null;

    const artwork = new Artwork({
      ...req.body,
      image: imagePath,
      status: req.body.status || "active",
    });

    await artwork.save();

    // تحديث الفنان
    if (artwork.artist) {
      await Artist.findByIdAndUpdate(artwork.artist, { $addToSet: { artworks: artwork._id } });
    }



    // تحديث المعرض
    if (artwork.exhibition) {
      await Exhibition.findByIdAndUpdate(artwork.exhibition, { $addToSet: { artworks: artwork._id } });
      if (artwork.artist) {
        await Exhibition.findByIdAndUpdate(artwork.exhibition, { $addToSet: { artists: artwork.artist } });
      }
    }

    const populatedArtwork = await Artwork.findById(artwork._id)
      .populate("artist", "name bio nationality")
      .populate("exhibition", "name startDate endDate");

    res.status(201).json(populatedArtwork);
  } catch (error) {
    res.status(500).json({ message: "Error creating artwork", error: error.message });
  }
};

export const getArtworks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.artistId) {
      filter.artist = req.query.artistId;
    }

    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    const total = await Artwork.countDocuments(filter);
    const artworks = await Artwork.find(filter)
      .populate("artist", "name")
      .skip(skip)
      .limit(limit);

    res.json({
      data: artworks,
      page,
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 🔹 جلب عمل فني حسب الـ ID
export const getArtworkById = async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate("artist", "name bio nationality")
      .populate("exhibition", "name startDate endDate");

    if (!artwork) return res.status(404).json({ message: "Artwork not found" });
    res.status(200).json(artwork);
  } catch (error) {
    res.status(500).json({ message: "Error fetching artwork", error: error.message });
  }
};

export const getRandomArtworks = async (req, res) => {
  try {
    const limit = Math.max(1, Number(req.query.limit) || 3);
    const artworks = await Artwork.aggregate([{ $sample: { size: limit } }]);
    res.status(200).json({ data: artworks });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 تعديل عمل فني
export const updateArtwork = async (req, res) => {
  try {
    const oldArtwork = await Artwork.findById(req.params.id);
    if (!oldArtwork) return res.status(404).json({ message: "Artwork not found" });

    const updateData = { ...req.body };

    if (req.file) {
      // احذف الصورة القديمة من السيرفر
      if (oldArtwork.image) {
        const oldPath = path.join("uploads", path.basename(oldArtwork.image));
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      updateData.image = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    const updated = await Artwork.findByIdAndUpdate(req.params.id, updateData, { new: true });

    // تحديث الفنان إذا تغير
    if (updateData.artist && oldArtwork.artist?.toString() !== updateData.artist) {
      if (oldArtwork.artist) {
        await Artist.findByIdAndUpdate(oldArtwork.artist, { $pull: { artworks: oldArtwork._id } });
      }
      await Artist.findByIdAndUpdate(updateData.artist, { $addToSet: { artworks: updated._id } });

      if (updated.exhibition) {
        await Exhibition.findByIdAndUpdate(updated.exhibition, { $addToSet: { artists: updateData.artist } });
      }
    }

    // تحديث المعرض إذا تغير
    if (updateData.exhibition && oldArtwork.exhibition?.toString() !== updateData.exhibition) {
      if (oldArtwork.exhibition) {
        await Exhibition.findByIdAndUpdate(oldArtwork.exhibition, { $pull: { artworks: oldArtwork._id } });
      }
      await Exhibition.findByIdAndUpdate(updateData.exhibition, { $addToSet: { artworks: updated._id } });

      if (updated.artist) {
        await Exhibition.findByIdAndUpdate(updateData.exhibition, { $addToSet: { artists: updated.artist } });
      }
    }

    const populatedUpdated = await Artwork.findById(updated._id)
      .populate("artist", "name bio nationality")
      .populate("exhibition", "name startDate endDate");

    res.status(200).json(populatedUpdated);
  } catch (error) {
    res.status(500).json({ message: "Error updating artwork", error: error.message });
  }
};

// 🔹 حذف عمل فني
export const deleteArtwork = async (req, res) => {
  try {
    const artwork = await Artwork.findByIdAndDelete(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });

    // حذف الصورة من السيرفر
    if (artwork.image) {
      const oldPath = path.join("uploads", path.basename(artwork.image));
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    if (artwork.artist) {
      await Artist.findByIdAndUpdate(artwork.artist, { $pull: { artworks: artwork._id } });
    }

    if (artwork.exhibition) {
      await Exhibition.findByIdAndUpdate(artwork.exhibition, { $pull: { artworks: artwork._id } });
    }

    res.status(200).json({ message: "Artwork deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting artwork", error: error.message });
  }
};
