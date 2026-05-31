#!/usr/bin/env node

/**
 * Admin Seed Script for Production
 * 
 * Usage:
 *   node scripts/seed-admin.mjs
 *   node scripts/seed-admin.mjs --email admin@company.com --name "John Doe"
 * 
 * Environment Variables:
 *   MONGODB_URI - MongoDB connection string (required)
 *   ADMIN_EMAIL - Default admin email (optional)
 *   ADMIN_NAME - Default admin name (optional)
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

// Import User model
const userSchemaPath = path.resolve(projectRoot, "src/models/User.js");
const { default: User } = await import(userSchemaPath);

// Parse command line arguments
const args = process.argv.slice(2);
const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  return index !== -1 && index + 1 < args.length ? args[index + 1] : null;
};

const ADMIN_EMAIL =
  getArgValue("--email") ||
  process.env.ADMIN_EMAIL ||
  "admin@production.local";

const ADMIN_NAME =
  getArgValue("--name") || 
  process.env.ADMIN_NAME ||
  "Admin User";

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "MONGODB_URI environment variable is required. " +
      "Set it in your .env file or as an environment variable."
    );
  }

  try {
    await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    console.log("✓ Connected to MongoDB");
  } catch (error) {
    console.error("✗ Failed to connect to MongoDB:");
    console.error(`  ${error.message}`);
    process.exit(1);
  }
}

async function seedAdminUser() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL.toLowerCase(),
    });

    if (existingAdmin) {
      console.log(
        `⚠ Admin user already exists with email: ${ADMIN_EMAIL}`
      );
      if (existingAdmin.role !== "admin") {
        console.log(
          `  Updating role from "${existingAdmin.role}" to "admin"...`
        );
        existingAdmin.role = "admin";
        existingAdmin.status = "active";
        await existingAdmin.save();
        console.log("✓ Admin user role updated");
      } else {
        console.log("  No updates needed.");
      }
      return;
    }

    // Create new admin user
    const adminUser = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL.toLowerCase(),
      role: "admin",
      status: "active",
      photoURL: `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
        ADMIN_NAME
      )}`,
    });

    console.log("✓ Admin user created successfully:");
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Name: ${adminUser.name}`);
    console.log(`  Role: ${adminUser.role}`);
    console.log(`  Status: ${adminUser.status}`);
  } catch (error) {
    console.error("✗ Failed to seed admin user:");
    console.error(`  ${error.message}`);
    throw error;
  }
}

async function main() {
  console.log("🌱 Admin Seed Script\n");
  console.log(`Configuration:`);
  console.log(`  MongoDB URI: ${process.env.MONGODB_URI || "NOT SET"}`);
  console.log(`  Admin Email: ${ADMIN_EMAIL}`);
  console.log(`  Admin Name: ${ADMIN_NAME}\n`);

  await connectDatabase();

  try {
    await seedAdminUser();
    console.log("\n✓ Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.log("\n✗ Seed failed");
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});

