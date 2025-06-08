// config/mongo.js
// import { MongoClient } from "mongodb";
// import UserMaster from "../models/user-master.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// const uri = process.env.MONGO_DB_URL
//   ? process.env.MONGO_DB_URL
//   : "mongodb://localhost:27017";
// console.log("Environment variable: ", process.env.MONGO_DB_URL);
// const client = new MongoClient(uri);

// let db;

// export const connectDb = async () => {
//   console.log("Inside db conn");
//   if (!db) {
//     await client.connect();
//     db = client.db("Office247");

//     const collection_Names = await db.collections();
//     console.log("Check collections: ", collection_Names);

//     // create collection

//   }
//   return db;
// };

export const connectDb = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/ProfileDB",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log("MongoDB connected using Mongoose");
  } catch (err) {
    console.error("MongoDB connection error", err);
    process.exit(1);
  }
};
