// backend/routes/contact.js
import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, msg: "كل الحقول مطلوبة" });
  }

  try {
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // App Password
  },
});


  const mailOptions = {
  from: process.env.SMTP_USER,
  to: "altsamuht@gmail.com",
  subject: subject || "رسالة جديدة من نموذج التواصل",
  text: `👤 Name: ${name}\n📧 Email: ${email}\n📝 Message: ${message}`,
};



    await transporter.sendMail(mailOptions);

    res.json({ success: true, msg: "تم إرسال الرسالة بنجاح" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({ success: false, msg: "فشل في الإرسال" });
  }
});

export default router;
