import mongoose, { Schema, Document } from "mongoose";

export interface IDeviceSession extends Document {
  userId: string;
  refreshTokenHash: string; // Hashed for security
  
  // 📍 Device Fingerprint
  ip: string;
  userAgent: string; // "Mozilla/5.0 (iPhone...)"
  deviceType: "mobile" | "desktop" | "tablet" | "unknown";
  os?: string;       // "iOS 17.2"
  browser?: string;  // "Safari"
  location?: string; // "Mumbai, India" (Approx from IP)
  
  lastActiveAt: Date;
  expiresAt: Date;
  isRevoked: boolean;
}

const DeviceSessionSchema = new Schema<IDeviceSession>(
  {
    userId: { type: String, required: true, index: true },
    refreshTokenHash: { type: String, required: true },
    
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    deviceType: { type: String, default: "unknown" },
    os: String,
    browser: String,
    location: String,

    lastActiveAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // Auto-delete from DB
    isRevoked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const DeviceSession = mongoose.model<IDeviceSession>("DeviceSession", DeviceSessionSchema);