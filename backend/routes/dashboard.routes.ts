import { Router } from "express";
import { Word } from "../models/word.model";
import { Note } from "../models/note.model"; 

const router = Router();

/**
 * GET /dashboard
 * Response:
 * {
 *   totalWords: number,
 *   byStatus: { perfect: number, almost: number, notYet: number },
 *   recentWords: Word[],
 *   recentNotes: Note[]
 * }
 */
router.get("/", async (req, res) => {
  try {
    // total words
    const totalWordsPromise = Word.countDocuments();

    // status counts (aggregation)
    const byStatusPromise = Word.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // recent words (latest created)
    const recentWordsPromise = Word.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("word meaning status createdAt")
      .lean();

    // recent notes (assumes you have Note model with createdAt)
    const recentNotesPromise = Note.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("noteTitle blocks createdAt") // あなたのスキーマに合わせて調整
      .lean();

    const [totalWords, byStatusRaw, recentWords, recentNotes] = await Promise.all([
      totalWordsPromise,
      byStatusPromise,
      recentWordsPromise,
      recentNotesPromise
    ]);

    // convert byStatusRaw [{_id:'perfect', count: 2}, ...] to object
    const byStatus: Record<string, number> = { perfect: 0, almost: 0, notYet: 0 };
    for (const r of byStatusRaw) {
      byStatus[r._id] = r.count;
    }

    res.json({
      totalWords,
      byStatus,
      recentWords,
      recentNotes
    });
  } catch (err: any) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: err.message || "Server error" });
  }
});

export default router;
