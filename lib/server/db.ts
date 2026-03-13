import mongoose from "mongoose";

import { serverEnv } from "@/lib/server/env";

declare global {
  var mongooseConnectionPromise: Promise<typeof mongoose> | undefined;
}

export async function connectDb() {
  if (!global.mongooseConnectionPromise) {
    global.mongooseConnectionPromise = mongoose.connect(serverEnv.mongodbUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      tls: true,
      family: 4,
      retryWrites: true
    });
  }

  return global.mongooseConnectionPromise;
}
