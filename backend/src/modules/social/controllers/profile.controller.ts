import { FastifyRequest, FastifyReply } from "fastify";
import { ProfilePrivacyService } from "../services/profile.privacy.service.js";
import { z } from "zod";

const usernameParam = z.object({ username: z.string() });

export class ProfileController {
  
  static async getProfile(req: FastifyRequest, reply: FastifyReply) {
    const { username } = usernameParam.parse(req.params);
    const viewerId = (req.user as any)?.sub; // Can be undefined if public view allowed
    
    if (!viewerId) {
      // Handle public view logic (restrictive)
      // For now, require login
      return reply.status(401).send({ error: "Login required to view profiles" });
    }

    const profile = await ProfilePrivacyService.getProfileForViewer(username, viewerId);
    return reply.send(profile);
  }
}