import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import userRoutes from "./routes/user.routes";
import wordRoutes from "./routes/word.routes";
import { connectDB } from './db/connect';

dotenv.config();                // Load .env first
const app = express();

// Global middleware 
app.use(cors());                // allow browser clients in dev
app.use(express.json());        // parse JSON bodies

app.use("/users", userRoutes);
app.use("/words", wordRoutes);

const PORT = process.env["PORT"] || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("DB connect failed:", err);
    process.exit(1);            // fail fast if DB is unreachable
  });