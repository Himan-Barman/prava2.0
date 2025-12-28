import mongoose, { Schema, Document } from "mongoose";

export interface IPreKey extends Document {
  userId: string; // The owner (UUID)
  deviceId: number; // Signal allows multiple devices (Phone, Laptop)
  
  // 🔐 Public Keys (Uploaded by Client)
  registrationId: number;
  identityKey: string;  // Long-term Identity (Public)
  signedPreKey: {
    keyId: number;
    publicKey: string;
    signature: string;
  };
  
  // ⚡ One-Time PreKeys (Server gives one to each new sender)
  // We store thousands of these per user.
  oneTimeKeys: {
    keyId: number;
    publicKey: string;
  }[];

  updatedAt: Date;
}

const PreKeySchema = new Schema<IPreKey>(
  {
    userId: { type: String, required: true, index: true },
    deviceId: { type: Number, required: true },
    
    registrationId: { type: Number, required: true },
    identityKey: { type: String, required: true },
    
    signedPreKey: {
      keyId: Number,
      publicKey: String,
      signature: String
    },

    oneTimeKeys: [{
      keyId: Number,
      publicKey: String
    }]
  },
  { timestamps: true }
);

// Unique index per device
PreKeySchema.index({ userId: 1, deviceId: 1 }, { unique: true });

export const PreKey = mongoose.model<IPreKey>("PreKey", PreKeySchema);