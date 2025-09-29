import Artist from '../models/Artist.js';

// إضافة فنان جديد
export const addArtist = async (req, res) => {
  try {
    const { name, bio, birthDate, nationality, featured, artworks, exhibitions } = req.body;

    const newArtist = new Artist({
      name,
      bio,
      birthDate,
      nationality,
      featured: featured ?? false,
      artworks: artworks || [],
      exhibitions: exhibitions || [],
    });

    await newArtist.save();
    res.status(201).json({ message: "Artist added successfully", artist: newArtist });
  } catch (error) {
    res.status(500).json({ message: "Error adding artist", error: error.message });
  }
};



// جلب الفنانين (مع فلترة بالـ query)
export const getAllArtists = async (req, res) => {
  try {
    const artists = await Artist.find()
      .populate("artworks")
      .populate("exhibitions");
    res.status(200).json(artists);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// جلب الفنانين المميزين فقط
export const getFeaturedArtists = async (req, res) => {
  try {
    const featuredArtists = await Artist.find({ featured: true })
      .populate("artworks")
      .populate("exhibitions");
    res.status(200).json(featuredArtists);
  } catch (error) {
    res.status(500).json({ message: "Error fetching featured artists", error: error.message });
  }
};

// جلب فنان محدد
export const getArtistById = async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id)
      .populate("artworks")
      .populate("exhibitions");
    if (!artist) return res.status(404).json({ message: "Artist not found" });
    res.status(200).json(artist);
  } catch (err) {
    res.status(500).json({ message: "Error fetching artist", error: err.message });
  }
};

export const getRandomArtists = async (req, res) => {
  try {
    const limit = Math.max(1, Number(req.query.limit) || 6);
    const sampled = await Artist.aggregate([{ $sample: { size: limit } }, { $project: { _id: 1 } }]);
    const ids = sampled.map((s) => s._id);

    const artists = await Artist.find({ _id: { $in: ids } });

    const ordered = ids.map((id) => artists.find((a) => String(a._id) === String(id))).filter(Boolean);

    return res.status(200).json({ data: ordered });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// تحديث فنان
export const updateArtist = async (req, res) => {
  try {
    const updatedArtist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedArtist) return res.status(404).json({ message: "Artist not found" });
    res.status(200).json({ message: "Artist updated successfully", artist: updatedArtist });
  } catch (error) {
    res.status(500).json({ message: "Error updating artist", error: error.message });
  }
};

// حذف فنان
export const deleteArtist = async (req, res) => {
  try {
    const artist = await Artist.findByIdAndDelete(req.params.id);
    if (!artist) return res.status(404).json({ message: "Artist not found" });
    res.status(200).json({ message: "Artist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting artist", error: error.message });
  }
};
