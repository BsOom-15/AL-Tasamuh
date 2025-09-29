// Server/routes/archiveRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import {
    getArchiveItems,
    getArchiveItemById,
    createArchiveItem,
    updateArchiveItem,
    deleteArchiveItem
} from "../controllers/archiveController.js";

const router = express.Router();

router.get("/", getArchiveItems);
router.get("/:id", getArchiveItemById);

// POST, PUT, DELETE
router.post("/", upload.single("image"), createArchiveItem);
router.put("/:id", upload.single("image"), updateArchiveItem);
router.delete("/:id", deleteArchiveItem);

export default router;
