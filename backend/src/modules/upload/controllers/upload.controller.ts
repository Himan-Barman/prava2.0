import { FastifyRequest, FastifyReply } from "fastify";
import { UploadService } from "../services/upload.service.js";

export class UploadController {
  
  static async uploadFile(req: FastifyRequest, reply: FastifyReply) {
    const data = await req.file(); // Get single file stream
    const result = await UploadService.processUpload(data);
    
    return reply.status(201).send(result);
  }
}