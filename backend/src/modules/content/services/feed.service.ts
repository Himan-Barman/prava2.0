import { redis } from "../../../@core/infrastructure/redis.js";
import { Post } from "../models/Post.js";
import { User } from "../../access/models/User.js";
import { Follow } from "../../social/models/Follow.js";
import { AppError } from "../../../@core/utils/AppError.js";

export class FeedService {
  
  /**
   * 🚀 GET HOME FEED (Hybrid Push/Pull)
   * This is the "Rolls Royce" engine.
   * 1. Try to read from Redis (Pre-computed timeline).
   * 2. If Redis is empty (cold start), Fallback to DB Query (Pull).
   * 3. Hydrate IDs to full Post objects.
   */
  static async getHomeFeed(userId: string, page = 1, limit = 20) {
    const user = await User.findOne({ userId });
    if (!user) throw new AppError("User not found", 404);

    const skip = (page - 1) * limit;
    const redisKey = `timeline:${user.userId}`;

    // 1. Try Redis First (Speed Layer)
    // lrange returns an array of Post IDs: ["ObjectId1", "ObjectId2"...]
    const cachedPostIds = await redis.lrange(redisKey, skip, skip + limit - 1);

    let posts;

    if (cachedPostIds.length > 0) {
      // ✅ HIT: We have IDs. Fetch the actual content.
      // We must preserve the order of IDs from Redis (most recent first).
      const unsortedPosts = await Post.find({ _id: { $in: cachedPostIds } })
        .populate("authorId", "username profile.displayName profile.avatar isVerified")
        .lean();

      // Sort the results to match the Redis order
      const postMap = new Map(unsortedPosts.map(p => [p._id.toString(), p]));
      posts = cachedPostIds.map(id => postMap.get(id)).filter(Boolean); // Filter nulls
    } else {
      // ❄️ MISS: Cold Start (User just signed up or Redis expired)
      // We do a "Pull" query to fill the gap.
      
      // Get who I follow
      const following = await Follow.find({ followerId: user._id }).select("followingId");
      const followingIds = following.map(f => f.followingId);

      // Add myself (I want to see my own posts)
      followingIds.push(user._id);

      posts = await Post.find({ authorId: { $in: followingIds } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("authorId", "username profile.displayName profile.avatar isVerified")
        .lean();

      // ⚡ OPTIONAL: Re-populate Redis for next time (Self-Healing)
      if (page === 1 && posts.length > 0) {
        const ids = posts.map(p => p._id.toString());
        // Push to Redis in reverse order (so newest is at head)
        await redis.lpush(redisKey, ...ids.reverse()); 
        await redis.ltrim(redisKey, 0, 500); // Keep max 500 items
        await redis.expire(redisKey, 60 * 60 * 24); // Cache for 24h
      }
    }

    // Rolls Royce Touch: Add "Liked by Me" state
    // In a real app, you'd fetch this from a 'Reaction' table
    return posts.map(post => ({
      ...post,
      isLiked: false, // Placeholder for Phase 5 (Interactions)
      isReposted: false
    }));
  }

  /**
   * 👤 GET USER PROFILE FEED
   * Simple DB query, indexed by authorId.
   */
  static async getUserFeed(targetUsername: string, page = 1, limit = 20) {
    const target = await User.findOne({ username: targetUsername });
    if (!target) throw new AppError("User not found", 404);

    const skip = (page - 1) * limit;

    const posts = await Post.find({ authorId: target._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("authorId", "username profile.displayName profile.avatar isVerified")
      .lean();

    return posts;
  }
}