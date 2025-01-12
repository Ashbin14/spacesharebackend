import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import userProfie from "./routes/userRoute.js";
import spaceRoutes from "./routes/spaceRoutes.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: "*", // Adjust origin for production
  })
);

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error(
    "MongoDB URI not defined. Make sure to add it to your .env file."
  );
  process.exit(1);
}

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Static file serving for images
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // This is correct

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/space", spaceRoutes); // Ensure `spaceRoutes` handles "/create", "/get", etc.
app.use("/profile", userProfie);

// Multer error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        error: "File size is too large. Maximum size is 5MB",
      });
    }
    if (error.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        error: "File limit exceeded. Maximum 5 images allowed",
      });
    }
  }
  res.status(500).json({ error: error.message });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
