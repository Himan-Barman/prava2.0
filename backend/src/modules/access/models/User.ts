import mongoose, { Schema, Document } from "mongoose";
import crypto from "crypto";

/* =======================================================
   INTERFACES (Type Safety)
======================================================= */

// 🔒 THE VAULT: Zero-Knowledge Storage
interface IVault {
  encryptedProfileKey: string; // AES-256-GCM
  keySalt: string;
  version: number;
}

// 🛡️ SECURITY SETTINGS
interface ISecurity {
  mfa: {
    enabled: boolean;
    method: "totp" | "passkey" | "sms";
    secret?: string; 
    backupCodes: string[]; 
  };
  antiPhishingCode?: string; 
  loginAlerts: boolean;
  lastPasswordChange: Date;
  sudoModeActiveUntil?: Date; 
}

// 🎭 PRIVACY (Granular Control)
interface IPrivacy {
  profileVisibility: "public" | "friends" | "none";
  searchability: "everyone" | "friends" | "exact_handle";
  readReceipts: boolean;
  activityStatus: boolean;
  allowTagging: "everyone" | "friends" | "none";
  dataCollectionConsent: boolean; 
}

// 🏆 GAMIFICATION & REPUTATION
interface IReputation {
  score: number; 
  badges: string[]; 
  level: number;
  isVip: boolean; 
}

export interface IUser extends Document {
  // Core Identity
  userId: string; 
  username: string;
  email: string;
  emailHash: string; 
  phone?: string;
  isVerified: boolean;
  // Auth
  passwordHash: string;
  isEmailVerified: boolean; // [ADDED] Critical for auth flow
  vault: IVault;
  security: ISecurity;
  
  // Profile (Public Data)
  profile: {
    displayName: string;
    avatar?: string; 
    coverImage?: string; 
    bio?: string;
    website?: string;
    location?: string; 
    themeColor?: string; 
  };

  // Settings
  privacy: IPrivacy;
  preferences: {
    language: string;
    theme: "light" | "dark" | "system";
    reducedMotion: boolean;
  };

  // Systems
  reputation: IReputation;
  accountStatus: "active" | "suspended" | "banned" | "pending_deletion";
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    lastLoginAt: Date;
    deletionScheduledAt?: Date;
  };
}

/* =======================================================
   SCHEMA DEFINITION
======================================================= */

const UserSchema = new Schema<IUser>(
  {
    /* ---------------- IDENTITY ---------------- */
    userId: {
      type: String,
      default: () => crypto.randomUUID(),
      unique: true,
      index: true,
      immutable: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: /^[a-z0-9_.]+$/, 
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      select: false, 
    },
    emailHash: { type: String, index: true }, 
    phone: { type: String, select: false },

    passwordHash: { type: String, required: true, select: false },
    isEmailVerified: { type: Boolean, default: false }, // [ADDED]

    /* ---------------- 🔒 THE VAULT ---------------- */
    vault: {
      encryptedProfileKey: { type: String, select: false }, 
      keySalt: { type: String, select: false },
      version: { type: Number, default: 1 },
    },

    /* ---------------- 🛡️ SECURITY ---------------- */
    security: {
      mfa: {
        enabled: { type: Boolean, default: false },
        method: { type: String, enum: ["totp", "passkey", "sms"], default: "totp" },
        secret: { type: String, select: false },
        backupCodes: { type: [String], select: false },
      },
      antiPhishingCode: { type: String, select: false }, 
      loginAlerts: { type: Boolean, default: true },
      lastPasswordChange: { type: Date, default: Date.now },
    },

    /* ---------------- 🎭 PRIVACY ---------------- */
    privacy: {
      profileVisibility: { 
        type: String, 
        enum: ["public", "friends", "none"], 
        default: "public" 
      },
      searchability: { 
        type: String, 
        enum: ["everyone", "friends", "exact_handle"], 
        default: "everyone" 
      },
      readReceipts: { type: Boolean, default: true },
      activityStatus: { type: Boolean, default: true },
      allowTagging: { 
        type: String, 
        enum: ["everyone", "friends", "none"], 
        default: "everyone" 
      },
      dataCollectionConsent: { type: Boolean, default: false },
    },

    /* ---------------- 👤 PROFILE ---------------- */
    profile: {
      displayName: { type: String, required: true, maxlength: 50 },
      bio: { type: String, maxlength: 300 },
      avatar: String,
      coverImage: String,
      website: String,
      location: String,
      themeColor: { type: String, default: "#000000" },
    },

    /* ---------------- 🏆 REPUTATION ---------------- */
    reputation: {
      score: { type: Number, default: 100, index: -1 }, 
      badges: { type: [String], default: [] },
      level: { type: Number, default: 1 },
      isVip: { type: Boolean, default: false },
    },

    /* ---------------- ⚙️ PREFERENCES ---------------- */
    preferences: {
      language: { type: String, default: "en" },
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
      reducedMotion: { type: Boolean, default: false },
    },

    /* ---------------- 📊 METADATA ---------------- */
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "banned", "pending_deletion"],
      default: "active",
      index: true,
    },
    metadata: {
      lastLoginAt: Date,
      deletionScheduledAt: Date,
    },
  },
  {
    timestamps: true, 
    minimize: false, 
  }
);

/* =======================================================
   INDEXES & HOOKS
======================================================= */
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ "profile.displayName": "text" }); 

UserSchema.index(
  { "metadata.deletionScheduledAt": 1 }, 
  { expireAfterSeconds: 0 }
);

UserSchema.pre("save", function (next) {
  if (this.isModified("email")) {
    this.email = this.email.toLowerCase().trim();
    this.emailHash = crypto.createHash("sha256").update(this.email).digest("hex");
  }
  next();
});

export const User = mongoose.model<IUser>("User", UserSchema);