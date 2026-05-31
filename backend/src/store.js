import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.resolve(__dirname, "..");
const dataDir = path.join(backendRoot, "data");
const dbPath = path.join(dataDir, "db.json");

function svgDataUri(label, background) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect width="800" height="600" fill="${background}" />
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="40" fill="#fff">
        ${label}
      </text>
    </svg>
  `.trim();
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function now() {
  return new Date().toISOString();
}

function makeSeedState() {
  const ts = now();
  return {
    users: [
      {
        _id: `user-${crypto.randomUUID()}`,
        name: "Demo Admin",
        email: "admin@demo.local",
        photoURL: "https://api.dicebear.com/9.x/initials/svg?seed=Admin",
        role: "admin",
        status: "active",
        createdAt: ts,
        updatedAt: ts,
      },
      {
        _id: `user-${crypto.randomUUID()}`,
        name: "Demo Manager",
        email: "manager@demo.local",
        photoURL: "https://api.dicebear.com/9.x/initials/svg?seed=Manager",
        role: "manager",
        status: "active",
        createdAt: ts,
        updatedAt: ts,
      },
      {
        _id: `user-${crypto.randomUUID()}`,
        name: "Demo Buyer",
        email: "buyer@demo.local",
        photoURL: "https://api.dicebear.com/9.x/initials/svg?seed=Buyer",
        role: "buyer",
        status: "active",
        createdAt: ts,
        updatedAt: ts,
      },
    ],
    products: [
      {
        _id: `prod-${crypto.randomUUID()}`,
        name: "Classic Cotton Shirt",
        category: "shirt",
        description: "A breathable cotton shirt for everyday office and casual wear.",
        price: 24,
        availableQuantity: 250,
        moq: 10,
        paymentOption: "Cash on Delivery",
        images: [svgDataUri("Cotton Shirt", "#4f46e5")],
        demoVideoLink: "",
        showOnHome: true,
        featured: true,
        addedByEmail: "manager@demo.local",
        createdAt: ts,
        updatedAt: ts,
      },
      {
        _id: `prod-${crypto.randomUUID()}`,
        name: "Modern Utility Jacket",
        category: "jacket",
        description: "A lightweight jacket with clean lines and production-ready stitching.",
        price: 58,
        availableQuantity: 120,
        moq: 5,
        paymentOption: "Pay First",
        images: [svgDataUri("Utility Jacket", "#0f766e")],
        demoVideoLink: "",
        showOnHome: true,
        featured: true,
        addedByEmail: "manager@demo.local",
        createdAt: ts,
        updatedAt: ts,
      },
      {
        _id: `prod-${crypto.randomUUID()}`,
        name: "Slim Fit Denim Pant",
        category: "pant",
        description: "Durable denim pants with a slim fit and premium finishing.",
        price: 31,
        availableQuantity: 180,
        moq: 8,
        paymentOption: "Cash on Delivery",
        images: [svgDataUri("Denim Pant", "#7c3aed")],
        demoVideoLink: "",
        showOnHome: false,
        featured: false,
        addedByEmail: "manager@demo.local",
        createdAt: ts,
        updatedAt: ts,
      },
      {
        _id: `prod-${crypto.randomUUID()}`,
        name: "Leather Belt Set",
        category: "accessories",
        description: "A compact belt set for retail bundles and gift packs.",
        price: 12,
        availableQuantity: 500,
        moq: 20,
        paymentOption: "Pay First",
        images: [svgDataUri("Belt Set", "#b45309")],
        demoVideoLink: "",
        showOnHome: false,
        featured: false,
        addedByEmail: "manager@demo.local",
        createdAt: ts,
        updatedAt: ts,
      },
    ],
    orders: [],
  };
}

function ensureDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify(makeSeedState(), null, 2), "utf8");
  }
}

export function loadDb() {
  ensureDb();
  return JSON.parse(fs.readFileSync(dbPath, "utf8"));
}

export function saveDb(db) {
  ensureDb();
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf8");
}

export function clone(value) {
  return globalThis.structuredClone ? structuredClone(value) : JSON.parse(JSON.stringify(value));
}

export function newId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function isoNow() {
  return now();
}

export function getDbPath() {
  ensureDb();
  return dbPath;
}

