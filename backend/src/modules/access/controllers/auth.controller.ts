import { FastifyRequest, FastifyReply } from "fastify";
import { AuthService } from "../services/auth.service.js";
import { z } from "zod";

const signupBody = z.object({
  name: z.string().min(2).max(50),
  username: z.string().min(3).max(30).regex(/^[a-z0-9_.]+$/),
  email: z.string().email(),
  password: z.string().min(8),
});

const verifyBody = z.object({
  userId: z.string(),
  code: z.string().length(6),
});

export class AuthController {
  
  static async register(req: FastifyRequest, reply: FastifyReply) {
    const body = signupBody.parse(req.body);
    const result = await AuthService.signup(body);
    return reply.status(201).send(result);
  }

  static async verify(req: FastifyRequest, reply: FastifyReply) {
    const body = verifyBody.parse(req.body);
    const result = await AuthService.verifyOtp(body.userId, body.code);
    return reply.send(result);
  }

  static async login(req: FastifyRequest, reply: FastifyReply) {
    const { identifier, password } = req.body as any;
    const user = await AuthService.login(identifier, password);

    const token = await reply.jwtSign(
      { sub: user.userId, username: user.username },
      { expiresIn: "7d" }
    );

    return reply.send({
      token,
      user: {
        id: user.userId,
        username: user.username,
        displayName: user.profile.displayName,
        avatar: user.profile.avatar,
        badges: user.reputation.badges, // Show off those badges
        isVip: user.reputation.isVip
      }
    });
  }
}