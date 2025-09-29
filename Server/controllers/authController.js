import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendMail } from "../utils/mailer.js";
import { VITE_VITE_API_URL } from "../../client/config.js";

const createToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN });

// ✅ Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, admin.password);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const payload = { id: admin._id, email: admin.email, role: admin.role };
  const token = createToken(payload);
  const refreshToken = createRefreshToken(payload);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({ token, admin: { id: admin._id, name: admin.name, email: admin.email } });
};


// ✅ Get profile
export const profile = async (req, res) => {
  const admin = await Admin.findById(req.admin.id).select("-password");

  if (!admin) return res.status(404).json({ message: "Admin not found" });

  // تحويل اسم الملف إلى رابط كامل
  const avatarUrl = admin.avatar 
    ? `${process.env.SERVER_URL || `${VITE_VITE_API_URL}`}/uploads/avatars/${admin.avatar}`
    : "";

  res.json({ 
    admin: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      avatar: avatarUrl
    }
  });
};


// ✅ Change password
export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.admin.id);
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const match = await bcrypt.compare(oldPassword, admin.password);
  if (!match) return res.status(400).json({ message: "Old password incorrect" });

  admin.password = await bcrypt.hash(newPassword, 10);
  await admin.save();
  res.json({ message: "Password updated" });
};

// ✅ Update profile
export const updateProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (req.body.name) admin.name = req.body.name;
    if (req.body.email) admin.email = req.body.email;
    if (req.file) admin.avatar = req.file.filename;


    await admin.save();

    res.json({
  message: "Profile updated",
  admin: { id: admin._id, name: admin.name, email: admin.email, avatar: admin.avatar }
});


  } catch (err) {
    res.status(500).json({ message: "Error updating profile", error: err.message });
  }
};

// ✅ Forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  const resetToken = crypto.randomBytes(32).toString("hex");
  admin.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  admin.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  await admin.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendMail({
    to: admin.email,
    subject: "Password Reset",
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
  });

  res.json({ message: "Reset link sent to email" });
};


// ✅ Reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const admin = await Admin.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!admin) return res.status(400).json({ message: "Invalid or expired token" });

  admin.password = await bcrypt.hash(password, 10);
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpire = undefined;
  await admin.save();

  res.json({ message: "Password has been reset" });
};

// ✅ Send test email
export const sendTestEmail = async (req, res) => {
  try {
    await sendMail({
      to: req.admin.email,
      subject: "Test email from backend",
      html: "<p>This is a test email.</p>"
    });
    res.json({ message: "Email sent" });
  } catch (err) {
    res.status(500).json({ message: "Email failed", error: err.message });
  }
};

// ✅ Logout
export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out" });
};
