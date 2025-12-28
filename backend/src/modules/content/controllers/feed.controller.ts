import { FastifyRequest, FastifyReply } from "fastify";
import { FeedService } from "../services/feed.service.js";
import { PostService } from "../services/post.service.js";
import { z } from "zod";

const paginationQuery = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(20),
});

const createPostBody = z.object({
  content: z.string().min(1).max(1000),
  media: z.array(z.object({
    type: z.enum(["image", "video"]),
    url: z.string().url(),
    aspectRatio: z.number().optional()
  })).optional().default([])
});

export class FeedController {
  
  static async getHomeTimeline(req: FastifyRequest, reply: FastifyReply) {
    const { page, limit } = paginationQuery.parse(req.query);
    const userId = (req.user as any).sub;

    const posts = await FeedService.getHomeFeed(userId, page, limit);
    return reply.send(posts);
  }

  static async createPost(req: FastifyRequest, reply: FastifyReply) {
    const body = createPostBody.parse(req.body);
    const userId = (req.user as any).sub;

    const post = await PostService.createPost(userId, body);
    return reply.status(201).send(post);
  }

  static async getUserTimeline(req: FastifyRequest, reply: FastifyReply) {
    const { username } = req.params as { username: string };
    const { page, limit } = paginationQuery.parse(req.query);

    const posts = await FeedService.getUserFeed(username, page, limit);
    return reply.send(posts);
  }
}