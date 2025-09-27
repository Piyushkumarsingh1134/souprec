import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Bearer <token>
  console.log(token);

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded; // ✅ cast to any
    next();
  } catch (error) {
    return res.status(403).json({ error: "Invalid token" });
  }
};
