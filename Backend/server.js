import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Use environment port or fallback
const PORT = process.env.PORT || 5001;

// ✅ CORS configuration
app.use(cors({
  origin: [
    "http://localhost:5173",          // Vite dev
    "http://localhost:3000",          // CRA dev
    "https://promptly.vercel.app",    // production frontend on Vercel
    "https://promptly-app.onrender.com" // production frontend on Render
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ API routes
app.use("/api", chatRoutes);

// ✅ Serve frontend build using project root
app.use(express.static(path.join(process.cwd(), "Frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(process.cwd(), "Frontend/dist/index.html"));
});

// ✅ Database connection + server start
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database");

    // Start server only after DB connection
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect with the DB", err);
    process.exit(1); // exit if DB connection fails
  }
};

connectDB();

// ✅ Error handler middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
