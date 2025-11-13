"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRoomsCreatedByUser = exports.createroom = void 0;
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
