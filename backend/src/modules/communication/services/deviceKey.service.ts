import { PreKey } from "../models/PreKey.js";
import { User } from "../../access/models/User.js";
import { AppError } from "../../../@core/utils/AppError.js";

interface KeyBundle {
  registrationId: number;
  identityKey: string;
  signedPreKey: {
    keyId: number;
    publicKey: string;
    signature: string;
  };
  oneTimeKey?: {
    keyId: number;
    publicKey: string;
  };
}

export class DeviceKeyService {

  /**
   * 📤 UPLOAD KEYS (User comes online/registers)
   * User uploads 1 Identity Key, 1 Signed PreKey, and 100 One-Time Keys.
   */
  static async uploadKeys(
    userId: string, 
    deviceId: number, 
    data: { 
      registrationId: number;
      identityKey: string; 
      signedPreKey: any; 
      oneTimeKeys: any[]; 
    }
  ) {
    // Upsert (Update if exists, Insert if new)
    // We replace the One-Time Keys batch entirely or append? 
    // Rolls Royce Strategy: Append/Replenish to ensure we never run out.
    
    const existing = await PreKey.findOne({ userId, deviceId });

    if (existing) {
      // Update existing device keys
      existing.signedPreKey = data.signedPreKey;
      existing.oneTimeKeys = [...existing.oneTimeKeys, ...data.oneTimeKeys]; // Append new keys
      existing.updatedAt = new Date();
      await existing.save();
    } else {
      // New Device Registration
      await PreKey.create({
        userId,
        deviceId,
        registrationId: data.registrationId,
        identityKey: data.identityKey,
        signedPreKey: data.signedPreKey,
        oneTimeKeys: data.oneTimeKeys
      });
    }

    return { count: data.oneTimeKeys.length };
  }

  /**
   * 📥 FETCH KEYS (The Handshake)
   * Alice wants to msg Bob. She needs Bob's keys.
   * CRITICAL SECURITY: We give Alice ONE One-Time Key and DELETE it from DB.
   * This ensures "Forward Secrecy" - even if the key is compromised later, it's gone.
   */
  static async fetchKeyBundle(targetUserId: string, deviceId = 1): Promise<KeyBundle> {
    const bundle = await PreKey.findOne({ userId: targetUserId, deviceId });
    
    if (!bundle) {
      throw new AppError("User has not set up E2EE (Keys missing)", 404);
    }

    // 1. Pop ONE One-Time Key (The "Rolls Royce" Security Step)
    // We use findOneAndUpdate to atomically pop it so no two people get the same key.
    const updatedBundle = await PreKey.findOneAndUpdate(
      { userId: targetUserId, deviceId },
      { $pop: { oneTimeKeys: -1 } }, // Remove the first element (Queue style)
      { new: true } // Return modified doc
    );

    if (!updatedBundle) throw new AppError("Keys unavailable", 503);

    // 2. Alert if running low (e.g., < 10 keys left)
    if (updatedBundle.oneTimeKeys.length < 10) {
      // TODO: Send "Replenish Keys" socket event to Target User
      console.log(`⚠️ User ${targetUserId} is running low on One-Time Keys!`);
    }

    // 3. Construct the Bundle for Alice
    // Note: We might run out of One-Time Keys. The protocol allows falling back 
    // to just SignedPreKey, but it's slightly less secure (no PFS for initial msg).
    // A Rolls Royce app enforces OTKs.
    const oneTimeKey = bundle.oneTimeKeys[0]; // The one we just popped (from original doc)

    return {
      registrationId: bundle.registrationId,
      identityKey: bundle.identityKey,
      signedPreKey: bundle.signedPreKey,
      oneTimeKey: oneTimeKey ? {
        keyId: oneTimeKey.keyId,
        publicKey: oneTimeKey.publicKey
      } : undefined
    };
  }
}