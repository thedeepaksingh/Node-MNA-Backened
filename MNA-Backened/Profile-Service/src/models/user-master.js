import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import mongooseDelete from "mongoose-delete";
import mongoosePaginate from "mongoose-paginate-v2";

const { Schema, model } = mongoose;

// ➤ Social account sub-schema
const SocialAccountSchema = new Schema({
  platform: {
    type: String,
    enum: ["google", "facebook", "linkedin", "github"],
    required: true,
  },
  accountId: { type: String, required: true },
  profileUrl: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  connectedAt: { type: Date, default: Date.now },
});

// ➤ Provider credentials sub-schema
const ProviderCredentialSchema = new Schema({
  providerName: { type: String, required: true },
  clientId: { type: String },
  clientSecret: { type: String },
  tokenType: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  scopes: [String],
  expiresAt: { type: Date },
});

// ➤ User profile sub-schema
const UserProfileSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: { type: String },
  alternatePhone: { type: String },
  address: {
    line1: String,
    line2: String,
    city: String,
    state: String,
    country: String,
    zip: String,
  },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  dateOfBirth: { type: Date },
  imageUrl: { type: String },
  bio: { type: String },
  website: { type: String },
  language: { type: String },
  timezone: { type: String },
});

// ➤ Login history sub-schema
const LoginHistorySchema = new Schema({
  ip: { type: String },
  userAgent: { type: String },
  location: { type: String },
  timestamp: { type: Date, default: Date.now },
  success: { type: Boolean, default: true },
});

// ➤ Access control list sub-schema
const ACLSchema = new Schema({
  resource: { type: String },
  permission: { type: String, enum: ["read", "write", "delete", "admin"] },
  grantedAt: { type: Date, default: Date.now },
});

// ➤ Main user schema
const UserMasterSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },

    role: {
      type: String,
      enum: ["admin", "user", "provider", "moderator", "guest", "superadmin"],
      default: "user",
    },

    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    phoneVerificationCode: { type: String },
    verificationExpires: { type: Date },

    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String },

    failedLoginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },

    refreshTokens: [String],

    profile: UserProfileSchema,
    socialAccounts: [SocialAccountSchema],
    providerCredentials: [ProviderCredentialSchema],
    loginHistory: [LoginHistorySchema],
    acl: [ACLSchema],

    metadata: {
      createdBy: String,
      createdFromIP: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ➤ Virtual: full name
UserMasterSchema.virtual("fullName").get(function () {
  return `${this.profile?.firstName || ""} ${
    this.profile?.lastName || ""
  }`.trim();
});

// ➤ Virtual: is account locked
UserMasterSchema.virtual("isLocked").get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// ➤ Pre-save hook: hash password if changed
UserMasterSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// ➤ Method: password match check
UserMasterSchema.methods.isPasswordMatch = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

// ➤ Plugins
UserMasterSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});
UserMasterSchema.plugin(mongoosePaginate);

// ➤ Export model
const UserMaster = model("UserMaster", UserMasterSchema, "UserMaster");
export default UserMaster;
