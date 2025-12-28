import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

/**
 * 🌍 Environment Schema
 * All environment variables MUST be declared here.
 * This guarantees type safety and fail-fast behavior.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number()
    .default(5000),

  MONGO_URI: z.string()
    .url(),

  REDIS_URL: z.string()
    .url(),

  JWT_SECRET: z.string()
    .min(32, "JWT_SECRET must be at least 32 characters"),

  COOKIE_SECRET: z.string()
    .min(32, "COOKIE_SECRET must be at least 32 characters"),

  CLIENT_URL: z.string()
    .url()
    .default("http://localhost:5173"),

  /**
   * ✉️ Resend Email API Key
   * Optional in dev/test, REQUIRED in production
   */
  RESEND_API_KEY: z.string().optional(),
});

export const env = (() => {
  const parsed = envSchema.parse(process.env);

  // 🚨 Hard fail in production if missing
  if (parsed.NODE_ENV === "production" && !parsed.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required in production");
  }

  return parsed;
})();
