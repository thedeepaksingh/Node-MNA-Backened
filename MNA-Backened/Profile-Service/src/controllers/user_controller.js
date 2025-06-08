import { connectDb } from "../dbConfig/connect-Mongodb.js";
import UserMaster from "../models/user-master.js";
import mongoose from "mongoose";

export const get_All_Users_Controller = async (req, res) => {
  try {
    await connectDb(); // Connect via Mongoose
    // await create_new_user();

    const users = await UserMaster.find(); // ✅ Use Mongoose model
    res.status(200).json(users);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const createUser = async (req, res) => {
  try {
    await connectDb();
    const newUser = new UserMaster({
      username: "deepak2709",
      email: "deepaksingh@example.com",
      passwordHash: "deepak2709",

      role: "superadmin",

      isEmailVerified: true,
      isPhoneVerified: false,

      profile: {
        firstName: "Deepak",
        lastName: "Singh",
        phoneNumber: "9801301484",
        alternatePhone: "976796712",
        address: {
          line1: "123 Main Street",
          city: "Gurgaon",
          state: " Haryana",
          country: "Bharat",
          zip: "122001",
        },
        gender: "Male",
        dateOfBirth: new Date("1993-04-27"),
        imageUrl: "https://example.com/images/deepak.jpg",
        bio: "Software engineer and open source enthusiast.",
        website: "https://deepak.dev",
        language: "en",
        timezone: "India/Delhi",
      },

      socialAccounts: [
        {
          platform: "github",
          accountId: "deepaksingh",
          profileUrl: "https://github.com/deepaksingh",
        },
        {
          platform: "linkedin",
          accountId: "deepak-singh",
          profileUrl: "https://linkedin.com/in/deepak-singh",
        },
      ],

      providerCredentials: [
        {
          providerName: "Google",
          clientId: "google-client-id",
          clientSecret: "google-secret",
          accessToken: "google-access-token",
          refreshToken: "google-refresh-token",
          scopes: ["profile", "email"],
          expiresAt: new Date(Date.now() + 3600 * 1000),
        },
      ],

      acl: [
        { resource: "profile", permission: "read" },
        { resource: "settings", permission: "write" },
      ],

      metadata: {
        createdBy: "admin-seed-script",
        createdFromIP: "127.0.0.1",
      },
    });

    await newUser.save();

    console.log("✅ New user created successfully:");
    const user_created = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      isLocked: newUser.isLocked,
    };
    console.log(user_created);

    mongoose.disconnect();
    res.status(200).send({ message: user_created });
  } catch (err) {
    console.error("❌ Error creating user:", err);
    mongoose.disconnect();
    res.status(404).send({ error: err });
  }
};
