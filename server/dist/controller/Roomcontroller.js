"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomDetails = exports.getRoomsCreatedByUser = exports.createroom = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const Validation_1 = require("../Validation");
const createroom = async (req, res) => {
    const parsedData = Validation_1.createRoomSchema.safeParse(req.body);
    const hostId = req.user.userId;
    if (!hostId) {
        return res.status(401).json({ message: "Unauthorized: missing hostId" });
    }
    if (!parsedData.success) {
        return res.status(401).json({
            message: "Invalid data",
        });
    }
    try {
        const room = await prisma.room.create({
            data: {
                roomCode: parsedData.data.roomCode,
                title: parsedData.data.title,
                description: parsedData.data.description,
                isLive: parsedData.data.isLive,
                hostId: hostId
            }, include: {
                host: true,
            }
        });
        res.status(201).json(room);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createroom = createroom;
const getRoomsCreatedByUser = async (req, res) => {
    try {
        const userId = req.user.userId;
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
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch rooms" });
    }
};
exports.getRoomsCreatedByUser = getRoomsCreatedByUser;
const getRoomDetails = async (req, res) => {
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
    }
    catch (error) {
        console.error("Chunk fetch error:", error);
        return res.status(500).json({ error: "Failed to fetch chunks" });
    }
};
exports.getRoomDetails = getRoomDetails;
