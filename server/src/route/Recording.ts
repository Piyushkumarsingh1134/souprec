import express from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate } from "../middleware";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/start", authenticate, async (req, res) => {
  try {
    const { roomCode } = req.body;

    console.log("logging the roomCode:", roomCode);

    if (!roomCode)
      return res.status(400).json({ error: "roomCode required" });

    const room = await prisma.room.findUnique({
      where: { roomCode }, // roomCode string
    });

    if (!room)
      return res.status(404).json({ error: "Room not found" });

    const recording = await prisma.recording.create({
      data: {
        roomId: room.id,
        storageUrl: "",
      },
    });

    res.json({ success: true, recordingId: recording.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to start recording" });
  }
});

export default router;
