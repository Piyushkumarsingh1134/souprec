"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
const cloudinary_1 = require("../lib/cloudinary");
const streamifier_1 = __importDefault(require("streamifier"));
const middleware_1 = require("../middleware");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/", upload.single("chunk"), middleware_1.authenticate, async (req, res) => {
    try {
        const { recordingId, index } = req.body;
        const userId = req.user.userId;
        console.log("logging the recordingId", recordingId);
        const file = req.file;
        console.log(recordingId);
        console.log(userId);
        if (!file || !userId || index === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        // Upload buffer as stream to Cloudinary
        const uploadStream = () => new Promise((resolve, reject) => {
            const stream = cloudinary_1.cloudinary.uploader.upload_stream({
                resource_type: "video",
                folder: `users/${userId}/rooms/${recordingId}/chunks`,
                public_id: `${recordingId}-chunk-${index}`,
                overwrite: true,
            }, (error, result) => {
                if (error || !result)
                    reject(error);
                else
                    resolve(result);
            });
            streamifier_1.default.createReadStream(file.buffer).pipe(stream);
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
    }
    catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Failed to upload chunk" });
    }
});
exports.default = router;
