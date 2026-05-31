/**
 * MongoDB Connection Utility
 * Provides helper functions for MongoDB Atlas and local MongoDB connections
 */

/**
 * Validate and format MongoDB connection string
 * @param {string} uri - MongoDB connection URI
 * @returns {{isAtlas: boolean, isValid: boolean, message: string}}
 */
export function validateMongoDBUri(uri) {
  if (!uri) {
    return {
      isAtlas: false,
      isValid: false,
      message: "MongoDB URI is required",
    };
  }

  const isAtlas = uri.startsWith("mongodb+srv://");
  const isLocalMongo = uri.startsWith("mongodb://");

  if (!isAtlas && !isLocalMongo) {
    return {
      isAtlas: false,
      isValid: false,
      message:
        'Invalid URI format. Use "mongodb+srv://" for Atlas or "mongodb://" for local',
    };
  }

  // Check for URI components
  try {
    if (isAtlas && !uri.includes("@")) {
      return {
        isAtlas: true,
        isValid: false,
        message: "Atlas URI must include username:password@cluster",
      };
    }

    if (isAtlas && !uri.includes(".mongodb.net")) {
      return {
        isAtlas: true,
        isValid: false,
        message: "Atlas URI must include .mongodb.net domain",
      };
    }

    return {
      isAtlas,
      isValid: true,
      message: isAtlas
        ? "Valid MongoDB Atlas connection string"
        : "Valid local MongoDB connection string",
    };
  } catch (error) {
    return {
      isAtlas,
      isValid: false,
      message: "Invalid URI format",
    };
  }
}

/**
 * Get recommended MongoDB options based on environment
 * @param {string} environment - 'production', 'development', or 'test'
 * @returns {object} Mongoose connection options
 */
export function getMongoDBOptions(environment = "development") {
  const baseOptions = {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  };

  if (environment === "production") {
    return {
      ...baseOptions,
      maxPoolSize: 20,
      minPoolSize: 5,
      maxIdleTimeMS: 45000,
      retryWrites: true,
      retryReads: true,
    };
  }

  if (environment === "test") {
    return {
      ...baseOptions,
      maxPoolSize: 2,
    };
  }

  // development
  return {
    ...baseOptions,
    maxPoolSize: 10,
    minPoolSize: 2,
  };
}

/**
 * Create a masked version of MongoDB URI for logging
 * @param {string} uri - MongoDB connection URI
 * @returns {string} Masked URI safe for logging
 */
export function maskMongoDBUri(uri) {
  if (!uri) return "NOT SET";

  // Replace password with asterisks
  return uri.replace(
    /([a-zA-Z0-9._-]+:[^@]+)@/,
    "****:****@"
  );
}

const __keep = [validateMongoDBUri, getMongoDBOptions, maskMongoDBUri];
void __keep;

