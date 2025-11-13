// cloudinary/lib/cloudinary.ts

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME as string,
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
});

/**
 * Upload buffer directly to Cloudinary
 */
export const uploadBufferToCloudinary = async (
  buffer: Buffer,
  folder: string = "chunks"
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "video",
      },
      (error, result) => {
        if (error || !result) {
          console.error("Cloudinary error:", error);
          reject(error);
        } else {
          resolve(result.secure_url);
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(upload);
  });
};

export { cloudinary };

