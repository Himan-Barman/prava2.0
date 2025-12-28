import { Schema, model, Document } from "mongoose";

export interface IBlock extends Document {
  blockerId: string;
  blockedId: string;
  createdAt: Date;
}

const BlockSchema = new Schema<IBlock>(
  {
    blockerId: {
      type: String,
      required: true,
      index: true
    },
    blockedId: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

// Prevent duplicate blocks
BlockSchema.index(
  { blockerId: 1, blockedId: 1 },
  { unique: true }
);

export const Block = model<IBlock>("Block", BlockSchema);
