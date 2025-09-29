// routes/exhibitionRoutes.js
import express from "express";
import upload from "../middleware/upload.js";
import {
  addExhibition,
  getAllExhibitions,
  getExhibitionById,
  getRandomExhibitions,
  updateExhibition,
  deleteExhibition,
} from "../controllers/exhibitionController.js";

const router = express.Router();

// نحدد الحقول الممكن استقبالها (cover, image, file)
const acceptImageFields = upload.fields([
  { name: "cover", maxCount: 1 },
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
]);

// GET random sample
router.get("/random", getRandomExhibitions);

// POST /api/exhibitions
router.post("/addexhibtions", acceptImageFields, addExhibition);

// GET all (or paginated if query params passed)
router.get("/", getAllExhibitions);

// GET by id
router.get("/:id", getExhibitionById);

// PUT /api/exhibitions/:id
router.put("/:id", acceptImageFields, updateExhibition);


// DELETE
router.delete("/:id", deleteExhibition);

export default router;
