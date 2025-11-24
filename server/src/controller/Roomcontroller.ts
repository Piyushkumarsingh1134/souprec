import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import { createRoomSchema } from "../Validation"
import { error } from "console";


export const createroom=async(req:Request,res:Response)=>{
    const parsedData=createRoomSchema.safeParse(req.body);
    const hostId = (req as any).user.userId;

 if (!hostId) {
  return res.status(401).json({ message: "Unauthorized: missing hostId" });
}
     if (!parsedData.success) {
    return res.status(401).json({
      message: "Invalid data",
    });
  }


   try {
        const room=await prisma.room.create({
            data:{
                roomCode:parsedData.data.roomCode,
                title:parsedData.data.title,
                description:parsedData.data.description,
                isLive:parsedData.data.isLive,
                hostId:hostId
            },include:{
                host:true,
            }
        })

        res.status(201).json(room);
   } catch (err:any) {
    res.status(400).json({ error: err.message });
   }

}

export const getRoomsCreatedByUser = async (req:Request, res:Response) => {
  try {
    const userId = (req as any).user.userId;

    const rooms = await prisma.room.findMany({
      where: {
        hostId: userId,
      },
      include: {
        participants: true,
        recordings: true,
      }
    });

    return res.json({ success: true, rooms });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch rooms" });
  }
};


export const getRoomDetails = async (req: Request, res: Response) => {
  try {
    const { roomCode } = req.query;

    if (!roomCode) {
      return res.status(400).json({ error: "room code required" });
    }

    // 1. Find the Room using roomCode
    const room = await prisma.room.findUnique({
      where: {
        roomCode: String(roomCode),
      },
    });

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // 2. Get all recordings for this room
    const recordings = await prisma.recording.findMany({
      where: { roomId: room.id },
    });

    if (recordings.length === 0) {
      return res.status(404).json({ error: "No recordings found" });
    }

    // 3. Get all chunks for these recordings (sorted)
    const chunks = await prisma.chunk.findMany({
      where: {
        recordingId: { in: recordings.map((r) => r.id) },
      },
      orderBy: { index: "asc" },
    });

    // 4. Send Response
    return res.json({
      roomCode,
      recordings: recordings.length,
      chunks: chunks.map((c) => ({
        index: c.index,
        url: c.storageUrl,
        recordingId: c.recordingId,
      })),
    });
  } catch (error) {
    console.error("Chunk fetch error:", error);
    return res.status(500).json({ error: "Failed to fetch chunks" });
  }
};
