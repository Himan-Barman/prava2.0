import { Worker } from "bullmq";
import { redis } from "../@core/infrastructure/redis.js"; // Connection
import { Follow } from "../modules/social/models/Follow.js";
import { env } from "../@core/config/env.js";

const connection = {
  host: new URL(env.REDIS_URL).hostname,
  port: Number(new URL(env.REDIS_URL).port) || 6379,
};

// 👷 THE WORKER
// Listens for "new_post" events and pushes Post ID to followers' timelines
export const feedWorker = new Worker("feed_queue", async (job) => {
  const { postId, authorId } = job.data;
  
  console.log(`🔨 Processing Fan-out for Post: ${postId}`);

  // 1. Get all followers (Batch size 1000 in real app)
  const followers = await Follow.find({ followingId: authorId }).select("followerId");
  
  // 2. Push to Redis Lists
  const pipeline = redis.pipeline();
  
  for (const follow of followers) {
    const key = `timeline:${follow.followerId}`; // Uses User UUID or ObjectId? Check your DB.
    // Assuming followerId is ObjectId, we convert to string.
    pipeline.lpush(key, postId);
    pipeline.ltrim(key, 0, 500); // Keep only top 500 posts
  }
  
  await pipeline.exec();
  console.log(`✅ Fan-out complete to ${followers.length} followers.`);

}, { connection });