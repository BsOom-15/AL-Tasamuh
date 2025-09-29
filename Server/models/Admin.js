import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: "" },
    role: { type: String, default: "admin" },

    // 🔹 لنسيت كلمة السر
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date }
  },
  { timestamps: true }
);


export default mongoose.model("Admin", adminSchema);
