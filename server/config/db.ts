import mongoose from "mongoose";

import { env } from "./env";

export async function connectDb() {
  await mongoose.connect(env.mongodbUri, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    tls: true,
    family: 4,
    retryWrites: true
  });
}
