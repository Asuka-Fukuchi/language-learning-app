import { Router } from "express";
import { Note } from "../models/note.model";
import { authMiddleware } from "../middleware/auth";
import multer from "multer";

const router = Router();

// Create a new word
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { noteTitle, blocks } = req.body;
    const creator = req.user?.id;

    if (!creator) return res.status(401).json({ error: "Unauthorized" });

    if (!noteTitle || !blocks) {
      return res.status(400).json({ error: "Missing required fields: noteTitle, blocks" });
    }

    const newNote = new Note({
      noteTitle,
      blocks,
      creator
    });

    await newNote.save();
    return res.status(201).json(newNote);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get all Words
router.get("/", authMiddleware, async (req, res) => {
  try {
    const filter = { creator: req.user!.id };
    const notes = await Note.find(filter);
    return res.status(200).json(notes);;
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
});

// Get Single Word by Id
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params["id"]);

    if (!note) return res.status(404).json({ error: "Note not found" });

    if (!note.creator.equals(req.user?.id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    return res.status(200).json(note);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Update word
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params["id"]);
    if (!note) return res.status(404).json({ error: "Note not found" });

    if (!note.creator.equals(req.user?.id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    delete req.body.creator;
    const allowed = ["noteTitle", "blocks"];

    for (const key of allowed) {
      if (key in req.body) {
        (note as any)[key] = req.body[key];
      }
    }

    await note.save();
    return res.status(200).json({ message: "Word updated successfully", note });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Delete Word
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const note = await Note.findById(req.params["id"]);
    if (!note) return res.status(404).json({ error: "Note not found" });

    if (!note.creator.equals(req.user?.id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    await note.deleteOne();

    return res.status(200).json({ message: "Note deleted successfully", note });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});


const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req: any, file: any, cb: any) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// POST /notes/upload
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }

  const url = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ url });
});

export default router;