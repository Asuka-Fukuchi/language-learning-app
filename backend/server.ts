import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/user.routes";
import wordRoutes from "./routes/word.routes";
import noteRoutes from "./routes/note.routes";
import { connectDB } from './db/connect';

console.log("🔥 SERVER TS STARTED");

dotenv.config();                // Load .env first
const app = express();

// Global middleware 
app.use(cors());                // allow browser clients in dev
app.use(express.json());        // parse JSON bodies

app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

app.use("/users", userRoutes);
app.use("/words", wordRoutes);
app.use("/notes", noteRoutes);

const PORT = Number(process.env["PORT"]) || 3000;

connectDB()
  .then(() => {
    console.log("Before app.listen");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
    console.log("After app.listen");
  })
  .catch((err) => {
    console.error("DB connect failed:", err);
    process.exit(1);            // fail fast if DB is unreachable
  });