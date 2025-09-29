import express from "express";
import {
  login,
  profile,
  changePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
  sendTestEmail,
  logout
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import uploadAvatar from "../middleware/uploadAvatar.js";

const router = express.Router();

// Auth
router.post("/login", login);
router.post("/logout", logout);

// Profile
router.get("/profile", protect, profile);
router.put("/update-profile", protect, uploadAvatar.single("avatar"), updateProfile);

// Password
router.put("/change-password", protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Email
router.post("/send-test-email", protect, sendTestEmail);

export default router;
