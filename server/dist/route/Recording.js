"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post("/start", middleware_1.authenticate, async (req, res) => {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to start recording" });
    }
});
exports.default = router;
