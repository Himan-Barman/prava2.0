import mongoose, { Schema, Document } from "mongoose";

export interface IFriendRequest extends Document {
  from: mongoose.Types.ObjectId; // User sending request
  to: mongoose.Types.ObjectId;   // User receiving request
  status: "pending" | "accepted" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const FriendRequestSchema = new Schema<IFriendRequest>(
  {
    from: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    to: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "rejected"], 
      default: "pending" 
    },
  },
  { timestamps: true }
);

// ⚡ Compound Index: Prevent duplicate requests between A and B
FriendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

export const FriendRequest = mongoose.model<IFriendRequest>("FriendRequest", FriendRequestSchema);