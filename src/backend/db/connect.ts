import mongoose from "mongoose";

export async function connectDB() {
  try {
    // TODO: delete when I submit app on the internet
    console.log("🔹 MONGODB_URI:", process.env["MONGODB_URI"]);

    if (!process.env["MONGODB_URI"]) {
      throw new Error("MONGODB_URI is not defined in .env");
    }

    await mongoose.connect(process.env["MONGODB_URI"]);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB connection error:", err);
    throw err;
  }
}

// DBへの接続はserver.tsに任せる
// connectDB();