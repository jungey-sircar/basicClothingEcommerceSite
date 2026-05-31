import mongoose from "mongoose";
import { validateMongoDBUri, getMongoDBOptions, maskMongoDBUri } from "./mongodb-utils.js";

mongoose.set("strictQuery", true);

let connectPromise;

/**
 * Connect to MongoDB (supports both local and Atlas)
 * @param {string} [uri] - MongoDB connection URI (defaults to MONGODB_URI env var)
 * @param {string} [environment] - 'development', 'production', or 'test'
 * @returns {Promise<mongoose.Connection>}
 * 
 * Examples:
 * - Local: mongodb://127.0.0.1:27017/garments-production-tracker
 * - Atlas: mongodb+srv://username:password@cluster.mongodb.net/garments-production-tracker
 */
export async function connectDatabase(uri = process.env.MONGODB_URI, environment = process.env.NODE_ENV || "development") {
  if (!uri) {
    throw new Error(
      "MONGODB_URI environment variable is required. " +
      "Use mongodb+srv for Atlas or mongodb for local MongoDB."
    );
  }

  // Validate URI format
  const validation = validateMongoDBUri(uri);
  if (!validation.isValid) {
    throw new Error(`Invalid MongoDB URI: ${validation.message}`);
  }

  // Already connected
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to MongoDB");
    return mongoose.connection;
  }

  if (!connectPromise) {
    const options = getMongoDBOptions(environment);
    console.log(`Connecting to MongoDB (${validation.isAtlas ? "Atlas" : "Local"})...`);
    
    connectPromise = mongoose.connect(uri, options);
  }

  try {
    await connectPromise;
    console.log("✓ Successfully connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    connectPromise = undefined;
    const maskedUri = maskMongoDBUri(uri);
    
    // Provide specific error messages for common issues
    let suggestion = "";
    if (validation.isAtlas) {
      suggestion = 
        "\nFor MongoDB Atlas:\n" +
        "  1. Verify IP whitelist includes your server IP\n" +
        "  2. Check username and password are correct\n" +
        "  3. Ensure cluster name matches your Atlas cluster\n" +
        "  4. Verify database name is correct";
    } else {
      suggestion = 
        "\nFor local MongoDB:\n" +
        "  1. Ensure MongoDB is running\n" +
        "  2. Check connection string format\n" +
        "  3. Verify database name is correct";
    }

    throw new Error(
      `Failed to connect to MongoDB at ${maskedUri}\n` +
      `Error: ${error.message}${suggestion}`
    );
  }
}

export async function disconnectDatabase() {
  connectPromise = undefined;
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  }
}

export function getConnectionState() {
  return mongoose.connection.readyState;
}

export function isConnected() {
  return mongoose.connection.readyState === 1;
}

