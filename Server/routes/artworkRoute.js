  import express from "express";
  import {
    getArtworks,
    getArtworkById,
    createArtwork,
    getRandomArtworks,
    updateArtwork,
    deleteArtwork,
  } from "../controllers/artworkController.js";
  import upload from "../middleware/upload.js";

  const router = express.Router();

  router.post("/", upload.single("image"), createArtwork);
  router.get("/", getArtworks);
  router.get("/random", getRandomArtworks); 
  router.get("/:id", getArtworkById);
  router.put("/:id", upload.single("image"), updateArtwork);
  router.delete("/:id", deleteArtwork);

  export default router;
