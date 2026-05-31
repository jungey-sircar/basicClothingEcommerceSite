#!/usr/bin/env node

/**
 * MongoDB Atlas Connection Validator
 * 
 * Usage:
 *   npm run validate-mongo
 *   node scripts/validate-mongo.mjs
 *   node scripts/validate-mongo.mjs mongodb+srv://user:pass@cluster.mongodb.net/db
 */

import dotenv from "dotenv";
import { validateMongoDBUri, maskMongoDBUri, getMongoDBOptions } from "../src/mongodb-utils.js";

dotenv.config();

const uri = process.argv[2] || process.env.MONGODB_URI;

console.log("🔍 MongoDB Connection Validator\n");
console.log("=" .repeat(60));

if (!uri) {
  console.log("\n⚠️  MONGODB_URI not provided");
  console.log("\nUsage:");
  console.log("  npm run validate-mongo");
  console.log("  node scripts/validate-mongo.mjs <connection-string>\n");
  process.exit(1);
}

console.log("\n📋 Connection String Analysis:");
console.log(`  Masked URI: ${maskMongoDBUri(uri)}\n`);

const validation = validateMongoDBUri(uri);

console.log("✓ Validation Result:");
console.log(`  Valid: ${validation.isValid ? "✓ Yes" : "✗ No"}`);
console.log(`  Type: ${validation.isAtlas ? "MongoDB Atlas" : "Local MongoDB"}`);
console.log(`  Message: ${validation.message}\n`);

if (!validation.isValid) {
  process.exit(1);
}

// Parse URI to extract components
console.log("📊 URI Components:");
try {
  if (validation.isAtlas) {
    // mongodb+srv://user:pass@cluster.mongodb.net/db
    const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^/]+)\/(.+)/);
    if (match) {
      const username = match[1];
      const password = "*".repeat(match[2].length);
      const cluster = match[3];
      const database = match[4].split("?")[0];
      const params = match[4].includes("?") ? match[4].split("?")[1] : "";

      console.log(`  Username: ${username}`);
      console.log(`  Password: ${password} (${match[2].length} chars)`);
      console.log(`  Cluster: ${cluster}`);
      console.log(`  Database: ${database}`);
      if (params) {
        console.log(`  Options: ${params}`);
      }
    }
  } else {
    // mongodb://[user:password@]host:port/db
    const match = uri.match(/mongodb:\/\/(.+)@?([^/]+)\/(.+)/);
    if (match) {
      const host = match[2] || match[1].split("/")[0];
      const database = match[3];
      console.log(`  Host: ${host}`);
      console.log(`  Database: ${database}`);
    }
  }
} catch (error) {
  console.log("  Could not parse URI components");
}

// Show recommended options
console.log("\n⚙️  Recommended Connection Options:");
const options = getMongoDBOptions("production");
Object.entries(options).forEach(([key, value]) => {
  console.log(`  ${key}: ${value}`);
});

// Security checklist
console.log("\n🔒 Security Checklist (For MongoDB Atlas):");
console.log("  [ ] IP whitelist configured with specific server IP");
console.log("  [ ] Strong password (20+ characters, mixed case, numbers, symbols)");
console.log("  [ ] Database user has minimal required roles");
console.log("  [ ] Connection string not committed to version control");
console.log("  [ ] .env file added to .gitignore");
console.log("  [ ] Backup and restore procedures documented");

// Connection test
console.log("\n🧪 To test the connection:");
console.log("  npm run dev");
console.log("  npm run seed-admin");
console.log("  curl http://localhost:5000/api/health\n");

console.log("=" .repeat(60));
process.exit(0);

