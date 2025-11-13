import express from "express";
import multer from "multer";
import { PrismaClient } from "@prisma/client";
import {cloudinary} from "../lib/cloudinary";
import streamifier from "streamifier";
import type { UploadApiResponse } from "cloudinary";
import { authenticate } from "../middleware";

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("chunk"),authenticate, async (req, res) => {
  try {
    const   { recordingId, index } = req.body;
    const userId = (req as any).user.userId;
    const file = req.file;

    if (!file || !userId || index === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Upload buffer as stream to Cloudinary
    const uploadStream = (): Promise<UploadApiResponse> =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "chunks",
            public_id: `${userId}_chunk_${index}`,
          },
          (error, result) => {
            if (error || !result) reject(error);
            else resolve(result);
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });

    const result = await uploadStream();

    // Save in DB
    const chunk = await prisma.chunk.create({
      data: {
        index: Number(index),
        storageUrl: result.secure_url,
        userId,
        recordingId: recordingId || null,
      },
    });

    res.status(200).json({ success: true, chunk });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload chunk" });
  }
});

export default router;
