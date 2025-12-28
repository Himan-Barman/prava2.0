import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import staticFiles from "@fastify/static";
import path from "path";
import fs from "fs";

// Core & Config
import { env } from "../../@core/config/env.js";
import { connectDB } from "../../@core/infrastructure/db.js";
import { appRouter } from "./router.js";
import { AppError } from "../../@core/utils/AppError.js";
import { z } from "zod";

// Sockets
import { Server } from "socket.io";
import { setupChatGateway } from "../../modules/communication/sockets/chat.gateway.js";

async function bootstrap() {
  const app = Fastify({ logger: true });

  // 1. Infrastructure Plugins
  await app.register(helmet, { crossOriginResourcePolicy: false }); // Allow images to load
  await app.register(cors, { origin: env.CLIENT_URL, credentials: true });
  await app.register(jwt, { secret: env.JWT_SECRET });
  await app.register(multipart, { limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB limit

  // 2. Static Files (For Local Uploads)
  const UPLOAD_DIR = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
  
  await app.register(staticFiles, {
    root: UPLOAD_DIR,
    prefix: "/uploads/", // Access via http://localhost:5000/uploads/filename.jpg
  });

  // 3. Database
  await connectDB();

  // 4. API Routes
  await app.register(appRouter, { prefix: "/api/v1" });

  // 5. Global Error Handler
  app.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({ error: error.message });
    }
    if (error instanceof z.ZodError) {
      return reply.status(400).send({ error: "Validation Error", issues: error.issues });
    }
    request.log.error(error);
    return reply.status(500).send({ error: "Internal Server Error" });
  });

  // 6. Start Server
  try {
    await app.ready(); // Ensure plugins loaded
    
    // Attach Socket.io to the Fastify HTTP server
    const io = new Server(app.server, {
      cors: { origin: env.CLIENT_URL, credentials: true },
      transports: ["websocket", "polling"]
    });

    // Initialize Socket Gateway
    setupChatGateway(io);

    await app.listen({ port: env.PORT, host: "0.0.0.0" });
    console.log(`\n🚀 Prava Engine Online: http://localhost:${env.PORT}`);
    console.log(`📂 Uploads serving at: http://localhost:${env.PORT}/uploads/`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

bootstrap();