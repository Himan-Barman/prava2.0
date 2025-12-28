import argon2 from "argon2";
import crypto from "crypto";
import { User } from "../models/User.js";
import { AppError } from "../../../@core/utils/AppError.js";
import { redis } from "../../../@core/infrastructure/redis.js"; // We'll create this

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export class AuthService {
  
  /* 1. REGISTER */
  static async signup(data: { name: string; username: string; email: string; password: string }) {
    // Check duplicates via Hash
    const emailHash = crypto.createHash("sha256").update(data.email.toLowerCase()).digest("hex");
    const exists = await User.exists({ $or: [{ emailHash }, { username: data.username }] });
    
    if (exists) throw new AppError("Username or Email already exists", 409);

    const passwordHash = await argon2.hash(data.password);
    const otpCode = generateOtp();

    // Create User (Schema defaults handle the rest)
    const user = await User.create({
      username: data.username,
      email: data.email,
      passwordHash,
      profile: { displayName: data.name },
      isEmailVerified: false,
    });

    // ⚡ Store OTP in Redis (Expire in 10 mins)
    await redis.set(`otp:${user.userId}`, otpCode, "EX", 600);

    // TODO: Send Email (mock for now)
    console.log(`[DEV] OTP for ${data.email}: ${otpCode}`);

    return { userId: user.userId, message: "Account created. Check email for OTP." };
  }

  /* 2. VERIFY OTP */
  static async verifyOtp(userId: string, code: string) {
    const storedOtp = await redis.get(`otp:${userId}`);
    
    if (!storedOtp || storedOtp !== code) {
      throw new AppError("Invalid or Expired OTP", 400);
    }

    await User.updateOne({ userId }, { isEmailVerified: true });
    await redis.del(`otp:${userId}`); // Consume OTP

    return { message: "Email Verified" };
  }

  /* 3. LOGIN */
  static async login(identifier: string, password: string) {
    const isEmail = identifier.includes("@");
    
    const query = isEmail 
      ? { emailHash: crypto.createHash("sha256").update(identifier.toLowerCase()).digest("hex") }
      : { username: identifier.toLowerCase() };

    // Select hidden fields needed for auth
    const user = await User.findOne(query).select("+passwordHash +vault +security");

    if (!user) throw new AppError("Invalid credentials", 401);

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid) throw new AppError("Invalid credentials", 401);

    return user;
  }
}