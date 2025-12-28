import { Server, Socket } from "socket.io";
import { redis } from "../../../@core/infrastructure/redis.js";
import { getRedis } from "../../../@core/infrastructure/redis.js"; // Subscribe client

export function setupChatGateway(io: Server) {
  
  // Dedicated Redis client for subscription (Blocking)
  const subClient = getRedis().duplicate();
  
  // 1. Listen for Redis events (from API nodes)
  subClient.subscribe("chat_delivery");
  
  subClient.on("message", (channel, text) => {
    if (channel === "chat_delivery") {
      const data = JSON.parse(text);
      // Emit to the specific user room: "user:UUID"
      io.to(`user:${data.recipientId}`).emit(data.event, data.payload);
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.handshake.auth.userId; // Passed from Client
    
    if (userId) {
      // 🟢 Join their personal encrypted channel
      socket.join(`user:${userId}`);
      console.log(`🔌 E2EE Socket Connected: ${userId}`);

      // Handle "Typing..." indicators (Ephemeral, not stored)
      socket.on("typing", (data) => {
        io.to(`user:${data.recipientId}`).emit("typing", { from: userId });
      });
    }

    socket.on("disconnect", () => {
      // Handle offline status
    });
  });
}