// controllers/exhibitionController.js
import Exhibition from "../models/Exhibition.js";
import Artist from "../models/Artist.js";
import Artwork from "../models/Artwork.js";
import fs from "fs";
import path from "path";

// helper to accept array or JSON string or comma-separated
const parseArrayField = (field) => {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  if (typeof field === "string") {
    try {
      const parsed = JSON.parse(field);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {}
    return field
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
};

const filePathFromUrl = (maybeUrl) => {
  if (!maybeUrl) return null;
  try {
    const filename = path.basename(maybeUrl);
    return path.join(process.cwd(), "uploads", filename);
  } catch (e) {
    return null;
  }
};

// CREATE
export const addExhibition = async (req, res) => {
  try {
    const { title, artist, date, overview, description } = req.body;
    const works = parseArrayField(req.body.works);
    const press = parseArrayField(req.body.press);
    const artists = parseArrayField(req.body.artists);

    // اقرأ الملف إذا رفعوه بأي اسم (cover, image, file)
    let uploadedFile = null;
    if (req.files) {
      if (req.files.cover && req.files.cover[0]) uploadedFile = req.files.cover[0];
      else if (req.files.image && req.files.image[0]) uploadedFile = req.files.image[0];
      else if (req.files.file && req.files.file[0]) uploadedFile = req.files.file[0];
    } else if (req.file) {
      uploadedFile = req.file;
    }

    const cover = uploadedFile
      ? `${req.protocol}://${req.get("host")}/uploads/${uploadedFile.filename}`
      : req.body.cover || null;

    const newEx = new Exhibition({
      title,
      artist,
      date,
      overview,
      description,
      works,
      press,
      cover,
      artists,
    });

    await newEx.save();

    // link artworks -> set exhibition
    if (works.length) {
      await Artwork.updateMany({ _id: { $in: works } }, { $set: { exhibition: newEx._id } });
    }

    // link artists -> add exhibition id
    const allArtists = [...new Set([artist, ...(artists || [])].filter(Boolean))];
    if (allArtists.length) {
      await Artist.updateMany({ _id: { $in: allArtists } }, { $addToSet: { exhibitions: newEx._id } });
    }

    const populated = await Exhibition.findById(newEx._id)
      .populate("artist", "name bio nationality")
      .populate("artists", "name")
      .populate({
        path: "works",
        select: "title image artist",
        populate: { path: "artist", select: "name" },
      });

    return res.status(201).json({ message: "Exhibition created", exhibition: populated });
  } catch (error) {
    console.error("addExhibition:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get All Exhibitions
export const getAllExhibitions = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const exs = await Exhibition.find()
      .populate("artist", "name") // الفنان الرئيسي
      .populate("artists", "name") // باقي الفنانين
      .populate({
        path: "works", // الأعمال المعروضة
        select: "title image artist",
        populate: { path: "artist", select: "name" },
      })
      .skip(skip)
      .limit(Number(limit));

    const total = await Exhibition.countDocuments();

    res.status(200).json({
      success: true,
      data: exs,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching exhibitions:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get Exhibition by ID
export const getExhibitionById = async (req, res) => {
  try {
    const ex = await Exhibition.findById(req.params.id)
      .populate("artist", "name bio nationality")
      .populate("artists", "name")
      .populate({
        path: "works",
        select: "title image medium dimensions notes year available",
        populate: { path: "artist", select: "name" },
      });

    if (!ex) return res.status(404).json({ message: "Exhibition not found" });

    // أضف isPast هنا برضو
    const withPast = {
      ...ex.toObject(),
      isPast: new Date(ex.date) < new Date(),
    };

    return res.status(200).json(withPast);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// UPDATE
export const updateExhibition = async (req, res) => {
  try {
    const exId = req.params.id;
    const existing = await Exhibition.findById(exId);
    if (!existing) return res.status(404).json({ message: "Exhibition not found" });

    const { title, artist, date, overview, description } = req.body;
    const works = parseArrayField(req.body.works);
    const press = parseArrayField(req.body.press);
    const artists = parseArrayField(req.body.artists);

    // new uploaded file (fields) support
    let uploadedFile = null;
    if (req.files) {
      if (req.files.cover && req.files.cover[0]) uploadedFile = req.files.cover[0];
      else if (req.files.image && req.files.image[0]) uploadedFile = req.files.image[0];
      else if (req.files.file && req.files.file[0]) uploadedFile = req.files.file[0];
    } else if (req.file) {
      uploadedFile = req.file;
    }

    // cover replacement
    if (uploadedFile) {
      if (existing.cover) {
        const oldPath = filePathFromUrl(existing.cover);
        if (oldPath && fs.existsSync(oldPath)) {
          try {
            fs.unlinkSync(oldPath);
          } catch (e) {
            console.warn("delete old cover failed", e);
          }
        }
      }
      existing.cover = `${req.protocol}://${req.get("host")}/uploads/${uploadedFile.filename}`;
    } else if (req.body.cover) {
      // user may pass a cover URL in body (keep it)
      existing.cover = req.body.cover;
    }

    if (title !== undefined) existing.title = title;
    if (date !== undefined) existing.date = date;
    if (overview !== undefined) existing.overview = overview;
    if (description !== undefined) existing.description = description;

    // handle artist change
    if (artist && String(artist) !== String(existing.artist)) {
      // remove ex from old artist
      if (existing.artist) await Artist.findByIdAndUpdate(existing.artist, { $pull: { exhibitions: existing._id } });
      // add ex to new artist
      await Artist.findByIdAndUpdate(artist, { $addToSet: { exhibitions: existing._id } });
      existing.artist = artist;
    }

    if (press.length) existing.press = press;
    if (artists.length) existing.artists = artists;

    // handle works change: remove old refs, add new refs
    if (Array.isArray(works)) {
      const oldWorks = (existing.works || []).map(String);
      const incoming = works.map(String);

      const toAdd = incoming.filter((id) => !oldWorks.includes(id));
      const toRemove = oldWorks.filter((id) => !incoming.includes(id));

      if (toRemove.length) {
        await Artwork.updateMany({ _id: { $in: toRemove } }, { $set: { exhibition: null } });
      }
      if (toAdd.length) {
        await Artwork.updateMany({ _id: { $in: toAdd } }, { $set: { exhibition: existing._id } });
      }

      existing.works = incoming;
    }

    await existing.save();

    // ensure participating artists have this exhibition in exhibitions array
    const allArtists = [...new Set([existing.artist, ...(existing.artists || [])].filter(Boolean))];
    if (allArtists.length) {
      await Artist.updateMany({ _id: { $in: allArtists } }, { $addToSet: { exhibitions: existing._id } });
    }

    const populated = await Exhibition.findById(existing._id)
      .populate("artist", "name bio nationality")
      .populate("artists", "name")
      .populate({
        path: "works",
        select: "title image artist",
        populate: { path: "artist", select: "name" },
      });

    return res.status(200).json({ message: "Exhibition updated", exhibition: populated });
  } catch (error) {
    console.error("updateExhibition:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// --- إضافة: Get random exhibitions
export const getRandomExhibitions = async (req, res) => {
  try {
    const limit = Math.max(1, Number(req.query.limit) || 3);

    // نأخذ عيّنة من الـ _id ثم نرجع الوثائق بعد populate
    const sampled = await Exhibition.aggregate([{ $sample: { size: limit } }, { $project: { _id: 1 } }]);
    const ids = sampled.map((s) => s._id);

    const exs = await Exhibition.find({ _id: { $in: ids } })
      .populate("artist", "name")
      .populate("artists", "name")
      .populate({
        path: "works",
        select: "title imageUrl artist",
        populate: { path: "artist", select: "name" },
      });

    // نعيد الترتيب كما جاء في العيّنة
    const ordered = ids.map((id) => exs.find((e) => String(e._id) === String(id))).filter(Boolean);

    return res.status(200).json({ data: ordered });
  } catch (err) {
    console.error("getRandomExhibitions:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// DELETE
export const deleteExhibition = async (req, res) => {
  try {
    const exId = req.params.id;
    const ex = await Exhibition.findByIdAndDelete(exId);
    if (!ex) return res.status(404).json({ message: "Exhibition not found" });

    // delete cover file
    if (ex.cover) {
      const oldPath = filePathFromUrl(ex.cover);
      if (oldPath && fs.existsSync(oldPath)) {
        try {
          fs.unlinkSync(oldPath);
        } catch (e) {
          console.warn("delete cover failed", e);
        }
      }
    }

    // clear artworks' exhibition ref
    if (ex.works && ex.works.length) {
      await Artwork.updateMany({ _id: { $in: ex.works } }, { $set: { exhibition: null } });
    }

    // remove exhibition from artists
    const allArtists = [
      ...new Set(
        [ex.artist ? ex.artist.toString() : "", ...(ex.artists || []).map((a) => a.toString())].filter(Boolean)
      ),
    ];
    if (allArtists.length) {
      await Artist.updateMany({ _id: { $in: allArtists } }, { $pull: { exhibitions: ex._id } });
    }

    return res.status(200).json({ message: "Exhibition deleted" });
  } catch (error) {
    console.error("deleteExhibition:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
