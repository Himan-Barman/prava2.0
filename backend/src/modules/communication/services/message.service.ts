import { Message } from "../models/Message.js";
import { Conversation } from "../models/Conversation.js";
import { User } from "../../access/models/User.js";
import { AppError } from "../../../@core/utils/AppError.js";
import { redis } from "../../../@core/infrastructure/redis.js";

/**
 * 📦 Message Types supported by the system
 * - text / image / audio → persisted messages
 * - call_offer → signaling message (still persisted)
 */
export type MessageType =
  | "text"
  | "image"
  | "audio"
  | "call_offer";

export class MessageService {

  /**
   * 📨 SEND ENCRYPTED MESSAGE
   * Server blindly stores the encrypted payload.
   */
  static async sendMessage(
    senderUuid: string,
    data: {
      recipientUuid: string;
      ciphertext: string; // Base64 encrypted blob
      iv: string;
      type: MessageType;
    }
  ) {
    /**
     * 1️⃣ Verify Participants
     */
    const [sender, recipient] = await Promise.all([
      User.findOne({ userId: senderUuid }),
      User.findOne({ userId: data.recipientUuid })
    ]);

    if (!sender || !recipient) {
      throw new AppError("User not found", 404);
    }

    /**
     * 2️⃣ Find or Create Conversation
     * A-B and B-A always resolve to the same document
     */
    const participants = [senderUuid, data.recipientUuid].sort();

    let conversation = await Conversation.findOne({
      participants: { $all: participants },
      type: "direct"
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants,
        type: "direct"
      });
    }

    /**
     * 3️⃣ Store the sealed box (ciphertext)
     */
    const message = await Message.create({
      conversationId: conversation._id,
      senderId: senderUuid,
      recipientId: data.recipientUuid,
      ciphertext: data.ciphertext,
      iv: data.iv,
      type: data.type,
      status: "sent"
    });

    /**
     * 4️⃣ Update conversation metadata
     */
    await Conversation.findByIdAndUpdate(conversation._id, {
      lastMessageAt: new Date()
    });

    /**
     * 5️⃣ Real-time delivery via Redis
     */
    await redis.publish(
      "chat_delivery",
      JSON.stringify({
        recipientId: data.recipientUuid,
        event: "new_message",
        payload: message
      })
    );

    return message;
  }

  /**
   * 📥 SYNC PENDING MESSAGES
   * Fetch all messages since last seen.
   */
  static async getPendingMessages(
    userId: string,
    lastMessageId?: string
  ) {
    const query: any = { recipientId: userId };

    if (lastMessageId) {
      query._id = { $gt: lastMessageId };
    }

    return Message.find(query)
      .sort({ createdAt: 1 })
      .limit(100);
  }
}
