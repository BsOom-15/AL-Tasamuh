import express from "express";
import { addArtist, getAllArtists, getArtistById, getRandomArtists ,updateArtist, deleteArtist } from "../controllers/artistController.js";

const router = express.Router();

router.get("/", getAllArtists);
router.get("/random", getRandomArtists);
router.post("/addArtist", addArtist);
router.get("/:id", getArtistById);
router.put("/:id", updateArtist);
router.delete("/:id", deleteArtist);

export default router;
