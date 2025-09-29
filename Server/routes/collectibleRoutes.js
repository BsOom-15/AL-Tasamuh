// Server/routes/collectibleRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import {
    createCollectible,
    getCollectibles,
    getCollectibleById,
    updateCollectible,
    deleteCollectible,
} from "../controllers/collectibleController.js";

const router = express.Router();

// public routes
router.get("/", getCollectibles);
router.get("/:id", getCollectibleById);

// temporarily allow all operations without auth
router.post("/", upload.single("image"), createCollectible);
router.put("/:id", upload.single("image"), updateCollectible);
router.delete("/:id", deleteCollectible);

export default router;
