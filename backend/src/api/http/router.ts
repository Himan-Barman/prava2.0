import { FastifyInstance } from "fastify";
import { AuthController } from "../../modules/access/controllers/auth.controller.js";
import { GraphController } from "../../modules/social/controllers/graph.controller.js";
import { ProfileController } from "../../modules/social/controllers/profile.controller.js";
import { FeedController } from "../../modules/content/controllers/feed.controller.js";
import { MessageController } from "../../modules/communication/controllers/message.controller.js";
import { UploadController } from "../../modules/upload/controllers/upload.controller.js";

export async function appRouter(app: FastifyInstance) {

  // 🏥 Health Check
  app.get("/health", async () => ({ status: "ok", version: "2.0.0" }));

  // 🔓 Public Routes
  app.post("/auth/signup", AuthController.register);
  app.post("/auth/verify", AuthController.verify);
  app.post("/auth/login", AuthController.login);

  // 🔐 Protected Routes (Require JWT)
  app.register(async (privateApp) => {
    privateApp.addHook("onRequest", async (req, reply) => {
      try { await req.jwtVerify(); } 
      catch (err) { reply.send(err); }
    });

    // 👤 Profile & Social
    privateApp.get("/profile/:username", ProfileController.getProfile);
    privateApp.post("/social/friend/:username", GraphController.addFriend);
    privateApp.post("/social/friend/accept", GraphController.acceptFriend);
    privateApp.post("/social/follow/:username", GraphController.follow);
    privateApp.delete("/social/follow/:username", GraphController.unfollow);

    // 🐦 Feed & Content
    privateApp.get("/feed/home", FeedController.getHomeTimeline);
    privateApp.get("/feed/user/:username", FeedController.getUserTimeline);
    privateApp.post("/posts", FeedController.createPost);

    // ☁️ Uploads
    privateApp.post("/upload", UploadController.uploadFile);

    // 💬 E2EE Communication
    privateApp.post("/keys", MessageController.uploadKeys);
    privateApp.get("/keys/:userId", MessageController.getKeyBundle);
    privateApp.post("/messages", MessageController.send);
    privateApp.get("/messages/sync", MessageController.getSync);
  });
}