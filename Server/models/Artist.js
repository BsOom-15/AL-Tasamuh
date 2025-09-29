import mongoose from 'mongoose';

const artistsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bio: { type: String },
    birthDate: { type: Date, required: true },
    nationality: { type: String },
    artworks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Artwork" }],
    exhibitions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exhibition" }],
    featured: { type: Boolean, default: false }
});

const Artist = mongoose.model('Artist', artistsSchema);
export default Artist;
