import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  authorId: mongoose.Types.ObjectId;
  content: string; // The text (max 280/500 chars)
  
  // 📸 Media (Twitter style: up to 4 images or 1 video)
  media: {
    type: "image" | "video";
    url: string;
    aspectRatio?: number; // For smooth UI loading
  }[];

  // 🏷️ Rich Entities (Parsed for performance)
  entities: {
    hashtags: string[];
    mentions: string[]; // Usernames
    urls: string[];
  };

  // ⚙️ Settings
  replyControl: "everyone" | "followed" | "mentioned"; // Who can reply?
  isEdited: boolean;
  
  // 📊 Metrics (Denormalized for read speed)
  stats: {
    likes: number;
    reposts: number;
    replies: number;
    views: number;
  };

  // 🧵 Threading
  parentPostId?: mongoose.Types.ObjectId; // If this is a reply
  rootPostId?: mongoose.Types.ObjectId;   // The top of the thread

  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    content: { type: String, required: true, maxlength: 1000, trim: true },
    
    media: [{
      type: { type: String, enum: ["image", "video"] },
      url: String,
      aspectRatio: Number
    }],

    entities: {
      hashtags: { type: [String], index: true },
      mentions: { type: [String], index: true },
      urls: [String]
    },

    replyControl: { 
      type: String, 
      enum: ["everyone", "followed", "mentioned"], 
      default: "everyone" 
    },
    isEdited: { type: Boolean, default: false },

    stats: {
      likes: { type: Number, default: 0 },
      reposts: { type: Number, default: 0 },
      replies: { type: Number, default: 0 },
      views: { type: Number, default: 0 }
    },

    parentPostId: { type: Schema.Types.ObjectId, ref: "Post", index: true },
    rootPostId: { type: Schema.Types.ObjectId, ref: "Post", index: true },
  },
  { timestamps: true }
);

// 🚀 Indexes for Feed Performance
PostSchema.index({ authorId: 1, createdAt: -1 }); // "Get user's posts"
PostSchema.index({ createdAt: -1 }); // "Global feed" (fallback)

export const Post = mongoose.model<IPost>("Post", PostSchema);