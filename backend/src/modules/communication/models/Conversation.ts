import mongoose, { Schema, Document } from "mongoose";

export interface IConversation extends Document {
  participants: string[]; // Array of UUIDs
  type: "direct" | "group";
  
  // For Groups only (Encrypted title? Maybe. Let's keep it simple for now)
  groupName?: string;
  groupAvatar?: string;
  admins?: string[];

  lastMessageAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: { type: [String], required: true, index: true }, // "Find chats for user X"
    type: { type: String, enum: ["direct", "group"], default: "direct" },
    
    groupName: String,
    groupAvatar: String,
    admins: [String],

    lastMessageAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Conversation = mongoose.model<IConversation>("Conversation", ConversationSchema);