"use strict";
// cloudinary/lib/cloudinary.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = exports.uploadBufferToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
Object.defineProperty(exports, "cloudinary", { enumerable: true, get: function () { return cloudinary_1.v2; } });
const streamifier_1 = __importDefault(require("streamifier"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
/**
 * Upload buffer directly to Cloudinary
 */
const uploadBufferToCloudinary = async (buffer, folder = "chunks") => {
    return new Promise((resolve, reject) => {
        const upload = cloudinary_1.v2.uploader.upload_stream({
            folder,
            resource_type: "video",
        }, (error, result) => {
            if (error || !result) {
                console.error("Cloudinary error:", error);
                reject(error);
            }
            else {
                resolve(result.secure_url);
            }
        });
        streamifier_1.default.createReadStream(buffer).pipe(upload);
    });
};
exports.uploadBufferToCloudinary = uploadBufferToCloudinary;
