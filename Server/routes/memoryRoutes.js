import express from "express";
import upload from "../middleware/upload.js"; // ← لازم تستورده
import {
  createMemoryItem,
  getMemoryItems,
  getMemoryItemById,
  updateMemoryItem,
  deleteMemoryItem,
} from "../controllers/memoryController.js";

const router = express.Router();

router.post("/", upload.single("image"), createMemoryItem);   // Create
router.get("/", getMemoryItems);                              // Read All
router.get("/:id", getMemoryItemById);                        // Read One
router.put("/:id", upload.single("image"), updateMemoryItem); // Update
router.delete("/:id", deleteMemoryItem);                      // Delete


export default router;
