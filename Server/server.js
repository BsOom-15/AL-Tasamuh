import express from 'express';
import path from "path";
import cors from 'cors';
import dotenv from 'dotenv';
import exhibitionsRoutes from './routes/exhibitionRoutes.js';
import artistRoute from './routes/artistRoute.js';
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import artworkRoute from "./routes/artworkRoute.js";
import collectibleRoutes from "./routes/collectibleRoutes.js";
import archiveRoutes from "./routes/archiveRoutes.js";
import memoryRoutes from "./routes/memoryRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { limiter } from "./middleware/rateLimiter.js";
import OpeningNight from './routes/openingNight.js';
import heroRoute from './routes/heroRoute.js';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173"
    // "https://your-netlify-app.netlify.app"
  ],
  credentials: true
}));

app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(limiter);

// ✅ Static files for images
app.use("/uploads", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Cross-Origin-Resource-Policy", "cross-origin");
  next();
}, express.static(path.join(process.cwd(), "uploads")));



// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/exhibitions', exhibitionsRoutes);
app.use('/api/artists', artistRoute);
app.use("/api/artworks", artworkRoute);
app.use("/api/collectibles", collectibleRoutes);
app.use("/api/hero", heroRoute);
app.use("/api/archive", archiveRoutes);
app.use("/api/memory-items", memoryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/opening-night", OpeningNight);

// Admin:
app.use("/api/admin", adminRoutes);

// Connect DB and start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
