import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

const uri = process.env.MONGO_URI;
const run = async () => {
  try {
    await mongoose.connect(uri);
    const email = process.env.SEED_ADMIN_EMAIL || "altsamuht@gmail.com";
    const password = process.env.SEED_ADMIN_PASSWORD || "123456";
    let admin = await Admin.findOne({ email });
    if (admin) {
      console.log("Admin already exists:", email);
      process.exit(0);
    }
    const hashed = await bcrypt.hash(password, 10);
    admin = new Admin({ name: "Super Admin", email, password: hashed });
    await admin.save();
    console.log("Admin created:", email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
run();
