import { Post } from "../models/Post.js";
import { User } from "../../access/models/User.js";
import { AppError } from "../../../@core/utils/AppError.js";
import { redis } from "../../../@core/infrastructure/redis.js";
// You will need a simple regex parser for hashtags
// import { extractEntities } from "../utils/textParser"; 

export class PostService {

  static async createPost(userId: string, data: { content: string; media?: any[] }) {
    // 1. Resolve User
    const author = await User.findOne({ userId }); // UUID -> ObjectId
    if (!author) throw new AppError("User not found", 404);

    // 2. Parse Text (Extract hashtags/mentions)
    // Simple implementation for now:
    const hashtags = (data.content.match(/#[a-z0-9_]+/gi) || []).map(t => t.slice(1).toLowerCase());
    const mentions = (data.content.match(/@[a-z0-9_.]+/gi) || []).map(t => t.slice(1));

    // 3. Create Post
    const post = await Post.create({
      authorId: author._id,
      content: data.content,
      media: data.media || [],
      entities: {
        hashtags,
        mentions,
        urls: [] // TODO: Add URL extractor
      }
    });

    // 4. 🚀 PUSH TO FEED (The "Twitter" Architecture)
    // We add a Job to BullMQ to "Fan-out" this post to all followers.
    // This makes the feed READ operation instant (O(1)).
    // await feedQueue.add('fanout', { postId: post._id, authorId: author._id });
    
    // For now, let's cache it in the Author's timeline in Redis immediately
    await redis.lpush(`timeline:${author.userId}`, post._id.toString());
    
    return post;
  }

  static async getGlobalFeed(limit = 20) {
    // Basic fallback for users with 0 followers
    return Post.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate("authorId", "username profile.displayName profile.avatar"); // Only fetch public fields
  }
}