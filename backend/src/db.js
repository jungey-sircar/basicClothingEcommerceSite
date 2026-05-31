import mongoose from "mongoose";

mongoose.set("strictQuery", true);

let connectPromise;

export async function connectDatabase(uri = process.env.MONGODB_URI) {
  if (!uri) {
    throw new Error("MONGODB_URI is required");
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectPromise) {
    connectPromise = mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
    });
  }

  await connectPromise;
  return mongoose.connection;
}

export async function disconnectDatabase() {
  connectPromise = undefined;
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}

export function getConnectionState() {
  return mongoose.connection.readyState;
}

export const databaseApi = {
  connectDatabase,
  disconnectDatabase,
  getConnectionState,
};

