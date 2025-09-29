import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000000, // تقريباً ما محدود
  message: { message: "Too many requests, please try again later." }
});
