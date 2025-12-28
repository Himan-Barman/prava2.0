import mongoose from "mongoose";
import { FriendRequest } from "../models/FriendRequest.js";
import { Follow } from "../models/Follow.js";
import { User } from "../../access/models/User.js"; 
import { AppError } from "../../../@core/utils/AppError.js";

export class GraphService {
  
  /* ================= FRIENDS (Bidirectional) ================= */

  static async sendFriendRequest(senderUuid: string, targetUsername: string) {
    // 1. Resolve Sender (UUID -> ObjectId)
    const sender = await User.findOne({ userId: senderUuid });
    if (!sender) throw new AppError("Sender account not found", 404);

    // 2. Resolve Target (Username -> ObjectId)
    const target = await User.findOne({ username: targetUsername });
    if (!target) throw new AppError("User not found", 404);
    
    // 3. Self-Friend Check
    if (sender._id.equals(target._id)) {
      throw new AppError("Cannot send friend request to yourself", 400);
    }

    // 4. Check existing connection
    const existing = await FriendRequest.findOne({
      $or: [
        { from: sender._id, to: target._id },
        { from: target._id, to: sender._id }
      ],
      status: { $in: ["pending", "accepted"] }
    });

    if (existing) {
      if (existing.status === "accepted") throw new AppError("You are already friends", 409);
      throw new AppError("Friend request already sent", 409);
    }

    // 5. Create Request (Using ObjectIds)
    await FriendRequest.create({
      from: sender._id,
      to: target._id
    });

    return { message: `Friend request sent to @${targetUsername}` };
  }

  static async acceptFriendRequest(userUuid: string, requestId: string) {
    // 1. Resolve User (UUID -> ObjectId)
    const user = await User.findOne({ userId: userUuid });
    if (!user) throw new AppError("User not found", 404);

    // 2. Find Request
    const request = await FriendRequest.findById(requestId);
    if (!request) throw new AppError("Friend request not found", 404);

    // 3. Security Check: Only the recipient can accept
    if (request.to.toString() !== user._id.toString()) {
      throw new AppError("Not authorized to accept this request", 403);
    }

    if (request.status !== "pending") {
      throw new AppError(`Request is already ${request.status}`, 400);
    }

    // 4. Update Status
    request.status = "accepted";
    await request.save();

    // 5. Rolls Royce Touch: Auto-Follow both ways
    // We use 'upsert' to ensure we don't duplicate if they already followed each other
    await Promise.all([
      Follow.updateOne(
        { followerId: request.from, followingId: request.to },
        { followerId: request.from, followingId: request.to },
        { upsert: true }
      ),
      Follow.updateOne(
        { followerId: request.to, followingId: request.from },
        { followerId: request.to, followingId: request.from },
        { upsert: true }
      )
    ]);

    return { message: "Friend request accepted" };
  }

  /* ================= FOLLOWS (Unidirectional) ================= */

  static async followUser(followerUuid: string, targetUsername: string) {
    // 1. Resolve Follower (UUID -> ObjectId)
    const follower = await User.findOne({ userId: followerUuid });
    if (!follower) throw new AppError("Your account not found", 404);

    // 2. Resolve Target (Username -> ObjectId)
    const target = await User.findOne({ username: targetUsername });
    if (!target) throw new AppError("User not found", 404);

    if (follower._id.equals(target._id)) {
      throw new AppError("Cannot follow yourself", 400);
    }

    // 3. Perform Follow
    await Follow.updateOne(
      { followerId: follower._id, followingId: target._id },
      { followerId: follower._id, followingId: target._id },
      { upsert: true }
    );

    return { message: `You are now following @${targetUsername}` };
  }

  static async unfollowUser(followerUuid: string, targetUsername: string) {
    // 1. Resolve Follower (UUID -> ObjectId)
    const follower = await User.findOne({ userId: followerUuid });
    if (!follower) throw new AppError("Your account not found", 404);

    // 2. Resolve Target (Username -> ObjectId)
    const target = await User.findOne({ username: targetUsername });
    if (!target) throw new AppError("User not found", 404);

    // 3. Remove Follow
    await Follow.deleteOne({ 
      followerId: follower._id, 
      followingId: target._id 
    });

    return { message: `Unfollowed @${targetUsername}` };
  }
}