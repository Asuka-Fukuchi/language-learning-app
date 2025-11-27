import { Router } from "express";
import { User } from "../models/user.model";
import { Word } from "../models/word.model";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { authMiddleware } from "../middleware/auth";

const router = Router();

async function isAdminById(userId: string) {
    if (!mongoose.isValidObjectId(userId)) return false;
    const u = await User.findById(userId).select("isAdmin").lean();
    return !!(u && (u as any).isAdmin);
}


// Register
router.post("/", async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const exists = await User.findOne({ email: email.toLowerCase().trim() });
        if (exists) {
            return res.status(409).json({ error: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email: email.toLowerCase().trim(),
            password: hashedPassword
        });

        const safe = user.toObject();
        delete (safe as any).password;
        return res.status(201).json(safe);
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error:  err.message });
    }
});

// Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Missing email or password" });
        }

        const user = await User.findOne
            ({ email: email.toLowerCase().trim() }).select("+password");

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials' });

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env["JWT_SECRET"] as string,
            { expiresIn: '3h' }
        );

        const safe = user.toObject();
        delete (safe as any).password;

        return res.json({ user: safe, token });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error:  err.message });
    }
});

// Get All Users
router.get("/", authMiddleware, async (req, res) => {
    try {
        const requesterId = req.user!.id;
        const isAdmin = await isAdminById(requesterId);
        if (!isAdmin) return res.status(403).json({ error: "Admin access required" });

        const users = await User.find().select("-password").lean();
        return res.json(users);
    } catch (err: any) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
});

// Get single user by id
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const targetId = req.params["id"];
        if (!mongoose.isValidObjectId(targetId)) return res.status(400).json({ error: "Invalid user ID" });

        const requesterId = req.user!.id;
        const isAdmin = await isAdminById(requesterId);

        if (!isAdmin && requesterId !== targetId) {
            return res.status(403).json({ error: "Access denied" });
        }

        const user = await User.findById(targetId).select("-password").lean();
        if (!user) return res.status(404).json({ error: "User not found" });

        return res.json(user);
    } catch (err: any) {
        return res.status(400).json({ error: err.message });
    }
})

// Update User by ID
router.patch("/:id", authMiddleware, async (req, res) => {
    try {
        const targetId = req.params["id"];
        if (!mongoose.isValidObjectId(targetId)) return res.status(400).json({ error: "Invalid user ID" });

        const requesterId = req.user!.id;
        if (requesterId !== targetId) return res.status(403).json({ error: "You can only update your own account" });

        const updates: any = { ...req.body };
        // Prevent accidental changes
        delete updates._id;
        delete updates.email; // optionally prevent email change here; or allow with verification flow
        delete updates.isAdmin; // prevent privilege escalation

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const updated = await User.findByIdAndUpdate(targetId, { $set: updates }, { new: true }).select("-password");
        if (!updated) return res.status(404).json({ error: "User not found" });

        return res.json({ message: "User updated", user: updated });
    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

// Delete user by id
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const targetId = req.params["id"];
        if (!mongoose.isValidObjectId(targetId)) return res.status(400).json({ error: "Invalid user ID" });

        const requesterId = req.user!.id;
        if (requesterId !== targetId) return res.status(403).json({ error: "You can only delete your own account" });

        const deletedUser = await User.findByIdAndDelete(targetId).select("-password");
        if (!deletedUser) return res.status(404).json({ error: "User not found" });

        // delete words created by this user
        const deletedWords = await Word.deleteMany({ creator: targetId });

        return res.json({ message: "User and their words deleted", user: deletedUser, deletedWordsCount: deletedWords.deletedCount });

    } catch (err: any) {
        return res.status(500).json({ error: err.message });
    }
});

export default router;