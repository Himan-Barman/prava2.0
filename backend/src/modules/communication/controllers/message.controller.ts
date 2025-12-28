import { FastifyRequest, FastifyReply } from "fastify";
import { DeviceKeyService } from "../services/deviceKey.service.js";
import { MessageService } from "../services/message.service.js";
import { z } from "zod";

// 🛡️ Validation Schemas
const uploadKeysBody = z.object({
  registrationId: z.number(),
  identityKey: z.string(),
  // We use .passthrough() or just z.any() for complex nested objects to avoid strict type conflicts
  signedPreKey: z.custom<any>(), 
  oneTimeKeys: z.array(z.custom<any>())
});

const sendMessageBody = z.object({
  recipientId: z.string().uuid(),
  ciphertext: z.string(),
  iv: z.string(),
  type: z.enum(["text", "image", "audio", "call_offer"]).default("text")
});

export class MessageController {

  /* --- KEYS --- */
  
  static async uploadKeys(req: FastifyRequest, reply: FastifyReply) {
    // 1. Validate
    const body = uploadKeysBody.parse(req.body);
    const userId = (req.user as any).sub;
    
    // 2. Call Service
    // We explicitly cast 'body' to satisfy the Service's need for specific types
    const result = await DeviceKeyService.uploadKeys(userId, 1, {
      registrationId: body.registrationId,
      identityKey: body.identityKey,
      signedPreKey: body.signedPreKey,
      oneTimeKeys: body.oneTimeKeys
    });
    
    // 3. Send Response
    return reply.send({
      message: "Keys uploaded successfully",
      count: result.count
    });
  }

  static async getKeyBundle(req: FastifyRequest, reply: FastifyReply) {
    const { userId } = req.params as { userId: string };
    const bundle = await DeviceKeyService.fetchKeyBundle(userId);
    return reply.send(bundle);
  }

  /* --- MESSAGES --- */

  static async send(req: FastifyRequest, reply: FastifyReply) {
    const body = sendMessageBody.parse(req.body);
    const senderId = (req.user as any).sub;

    const message = await MessageService.sendMessage(senderId, {
      recipientUuid: body.recipientId,
      ciphertext: body.ciphertext,
      iv: body.iv,
      type: body.type
    });

    return reply.status(201).send(message);
  }

  static async getSync(req: FastifyRequest, reply: FastifyReply) {
    const { since } = req.query as { since?: string };
    const userId = (req.user as any).sub;

    const messages = await MessageService.getPendingMessages(userId, since);
    return reply.send(messages);
  }
}