import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  email: string;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: { id: string; email: string };
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization header missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    const secret = process.env["JWT_SECRET"] || "secret";

    const decoded = jwt.verify(token, secret) as JwtPayload;

    // 認証済みユーザー情報を req.user にセット
    req.user = { id: decoded.id, email: decoded.email };

    return next();
  } catch (err: any) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
};