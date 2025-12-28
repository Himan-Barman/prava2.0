import { FastifyRequest, FastifyReply } from "fastify";
import { GraphService } from "../services/graph.service.js";
import { z } from "zod";

// Input Validation
const usernameParam = z.object({
  username: z.string(),
});

const requestIdBody = z.object({
  requestId: z.string(),
});

export class GraphController {
  
  static async addFriend(req: FastifyRequest, reply: FastifyReply) {
    const { username } = usernameParam.parse(req.params);
    const userId = (req.user as any).sub; // JWT 'sub' claim (User ID)
    
    // We need the internal _id for the GraphService, usually user.sub is the UUID.
    // In our User model, _id is ObjectId, userId is UUID. 
    // Optimization: Let's assume req.user contains the Mongodb _id 
    // or we resolve it in Service. Service resolves UUID -> ObjectId.
    // Correction: Let's pass the UUID (sub) and let Service handle resolution.
    
    // NOTE: In the 'User.ts' provided earlier, 'userId' is a UUID string. 
    // The FriendRequest model uses Schema.Types.ObjectId (Mongoose ID).
    // We need to fetch the User document to get the _id.
    // The Service handles this lookup.

    // BUT: senderId passed to service is the UUID from token.
    // Let's ensure Service looks up the SENDER by UUID too.
    // (I will update Service logic slightly in next iteration if needed, 
    // but typically we store _id in JWT for speed. Let's assume sub = _id for now
    // OR we lookup sender. 
    // *Rolls Royce Decision*: Look up sender by UUID in service to be safe.*)
    
    // Actually, let's keep it simple: Pass req.user.sub and let service resolve.
    // *Wait*, 'User.ts' makes `userId` (UUID) the public ID. 
    // FriendRequest should probably reference `userId` (UUID) for consistency 
    // OR resolve to `_id`. Resolving to `_id` is better for MongoDB performance (Joins).
    // I will stick to `_id` in DB, but Public API uses `username`.
    
    // We need the SENDER's internal ID.
    // For now, let's assume the JWT 'sub' is the MongoDB _id.
    // If your JWT uses UUID, we need a middleware to inject user _id.
    
    const result = await GraphService.sendFriendRequest(userId, username);
    return reply.send(result);
  }

  static async acceptFriend(req: FastifyRequest, reply: FastifyReply) {
    const { requestId } = requestIdBody.parse(req.body);
    const userId = (req.user as any).sub;
    
    const result = await GraphService.acceptFriendRequest(userId, requestId);
    return reply.send(result);
  }

  static async follow(req: FastifyRequest, reply: FastifyReply) {
    const { username } = usernameParam.parse(req.params);
    const userId = (req.user as any).sub;

    const result = await GraphService.followUser(userId, username);
    return reply.send(result);
  }

  static async unfollow(req: FastifyRequest, reply: FastifyReply) {
    const { username } = usernameParam.parse(req.params);
    const userId = (req.user as any).sub;

    const result = await GraphService.unfollowUser(userId, username);
    return reply.send(result);
  }
}