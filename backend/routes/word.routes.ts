import { Router } from "express";
import { Word } from "../models/word.model";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// Create a new word
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { word, phoneticSymbols, type, partOfSpeech, meaning, examples, synonyms, antonyms, tags }
      = req.body;
    const creator = req.user?.id;

    if (!creator) return res.status(401).json({ error: "Unauthorized" });

    if (!word || !meaning || !type || !Array.isArray(examples) || examples.length === 0) {
      return res.status(400).json({ error: "Missing required fields: word, meaning, type, examples(at least 1)" });
    }

    const newWord = new Word({
      word,
      phoneticSymbols,
      type,
      partOfSpeech,
      meaning,
      examples,
      synonyms,
      antonyms,
      tags,
      creator
    });

    await newWord.save();
    return res.status(201).json(newWord);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all Words
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = { creator: req.user!.id };
    const words = await Word.find(filter);
    return res.status(200).json(words);;
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Get Single Word by Id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const word = await Word.findById(req.params["id"]);

    if (!word) return res.status(404).json({ error: "Word not found" });

    if (!word.creator.equals(req.user?.id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.status(200).json(word);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Update word
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const word = await Word.findById(req.params["id"]);
    if (!word) return res.status(404).json({ error: "Word not found" });

    if (!word.creator.equals(req.user?.id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    delete req.body.creator;
    const allowed = [
      "word", "phoneticSymbols", "type", "partOfSpeech",
      "meaning", "examples", "synonyms", "antonyms",
      "tags", "spaced", "status"
    ];

    for (const key of allowed) {
      if (key in req.body) {
        (word as any)[key] = req.body[key];
      }
    }

    await word.save();
    return res.status(200).json({ message: "Word updated successfully", word });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete Word
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const word = await Word.findById(req.params["id"]);
    if (!word) return res.status(404).json({ error: "Word not found" });

    if (!word.creator.equals(req.user?.id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    await word.deleteOne();

    return res.status(200).json({ message: "Word deleted successfully", word });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

export default router;