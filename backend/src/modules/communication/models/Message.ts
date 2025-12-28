import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  conversationId: mongoose.Types.ObjectId;
  
  senderId: string; // UUID
  recipientId: string; // UUID (for 1:1 optimization)
  
  // 🔒 THE PAYLOAD (Sealed Box)
  ciphertext: string; // The encrypted blob
  iv: string;         // Initialization Vector
  version: number;    // Ratchet version

  // 🛡️ Metadata (Unencrypted for delivery, but minimal)
  type: "text" | "image" | "audio" | "call_offer"; 
  status: "sent" | "delivered" | "read";
  
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: "Conversation", required: true, index: true },
    senderId: { type: String, required: true },
    recipientId: { type: String, required: true, index: true }, // Index for "Get my messages"

    ciphertext: { type: String, required: true }, // 🛑 SERVER CANNOT READ THIS
    iv: { type: String, required: true },
    version: { type: Number, default: 1 },

    type: { type: String, default: "text" },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
  },
  { timestamps: true }
);

export const Message = mongoose.model<IMessage>("Message", MessageSchema);