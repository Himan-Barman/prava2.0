import { User, IUser } from "../../access/models/User.js";
import { FriendRequest } from "../models/FriendRequest.js";
import { Follow } from "../models/Follow.js";
import { Block } from "../models/Block.js"; // You'll need this model
import { AppError } from "../../../@core/utils/AppError.js";

// The DTO (Data Transfer Object) - What the frontend actually receives
interface PublicProfileDTO {
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;      // 🔒 Conditional
  location?: string; // 🔒 Conditional
  website?: string;  // 🔒 Conditional
  isVerified: boolean;
  stats: {
    followers: number;
    following: number;
    friends?: number; // 🔒 Conditional
  };
  relationship: {
    isFriend: boolean;
    isFollowing: boolean;
    friendRequestStatus: "none" | "pending_sent" | "pending_received";
    isBlocked: boolean;
  };
}

export class ProfilePrivacyService {

  static async getProfileForViewer(targetUsername: string, viewerId: string): Promise<PublicProfileDTO> {
    // 1. Fetch Target User (with privacy settings)
    const target = await User.findOne({ username: targetUsername });
    if (!target) throw new AppError("User not found", 404);

    // 2. Check Blocking (Rolls Royce Safety)
    // If viewer is blocked by target, or target is blocked by viewer -> 404 (Ghost them)
    const isBlocked = await Block.exists({
      $or: [
        { blockerId: target._id, blockedId: viewerId }, // They blocked me
        { blockerId: viewerId, blockedId: target._id }  // I blocked them
      ]
    });
    
    if (isBlocked) throw new AppError("User not found", 404); // Don't reveal they exist

    // 3. Determine Relationship
    const [friendship, follow, sentReq, receivedReq] = await Promise.all([
      FriendRequest.findOne({
        $or: [
          { from: viewerId, to: target._id },
          { from: target._id, to: viewerId }
        ],
        status: "accepted"
      }),
      Follow.exists({ followerId: viewerId, followingId: target._id }),
      FriendRequest.exists({ from: viewerId, to: target._id, status: "pending" }),
      FriendRequest.exists({ from: target._id, to: viewerId, status: "pending" }),
    ]);

    const isFriend = !!friendship;
    const isSelf = target.userId === viewerId;

    // 4. Privacy Logic (The Facebook Logic)
    // We start with a BASE profile (Public Data)
    const response: PublicProfileDTO = {
      userId: target.userId,
      username: target.username,
      displayName: target.profile.displayName,
      avatar: target.profile.avatar,
      coverImage: target.profile.coverImage,
      isVerified: target.isVerified,
      stats: {
        followers: 0, // TODO: Fetch real counts via aggregation
        following: 0,
      },
      relationship: {
        isFriend,
        isFollowing: !!follow,
        friendRequestStatus: sentReq ? "pending_sent" : receivedReq ? "pending_received" : "none",
        isBlocked: false
      }
    };

    // 5. Apply Granular Masks
    const visibility = target.privacy.profileVisibility; // 'public' | 'friends' | 'none'

    // RULE: If 'none', only show Name/Avatar (unless self)
    if (visibility === 'none' && !isSelf) {
      return response; 
    }

    // RULE: If 'friends', only show details if Friend or Self
    const canSeeDetails = isSelf || visibility === 'public' || (visibility === 'friends' && isFriend);

    if (canSeeDetails) {
      response.bio = target.profile.bio;
      response.website = target.profile.website;
      response.location = target.profile.location;
      // response.stats.friends = ... (Fetch count)
    }

    return response;
  }
}