import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import crypto from "crypto";
import { AppError } from "../../../@core/utils/AppError.js";
import { env } from "../../../@core/config/env.js";

// Ensure upload directory exists
const UPLOAD_DIR = path.join(process.cwd(), "uploads");
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

export class UploadService {
  
  /**
   * 📤 PROCESS UPLOAD
   * Saves stream to disk (Local). 
   * In Production: Replace 'pipeline' with AWS S3 Upload stream.
   */
  static async processUpload(part: any) {
    if (!part) throw new AppError("No file uploaded", 400);

    // 1. Validate Mime Type (Security)
    const allowed = ["image/jpeg", "image/png", "image/webp", "video/mp4"];
    if (!allowed.includes(part.mimetype)) {
      throw new AppError("Invalid file type. Only Images and MP4 allowed.", 400);
    }

    // 2. Generate Safe Filename (Random UUID)
    const ext = path.extname(part.filename);
    const randomName = crypto.randomUUID() + ext;
    const savePath = path.join(UPLOAD_DIR, randomName);

    // 3. Stream to Disk (Low RAM usage)
    await pipeline(part.file, fs.createWriteStream(savePath));

    // 4. Return Public URL
    // In Prod, this would be: `https://bucket.s3.amazonaws.com/${randomName}`
    return {
      url: `${env.CLIENT_URL}/uploads/${randomName}`,
      type: part.mimetype.startsWith("image") ? "image" : "video",
      mime: part.mimetype
    };
  }
}