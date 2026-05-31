import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { z } from "zod";
import { clone, isoNow, loadDb, newId, saveDb } from "./store.js";
import { getDbUserByEmail, requireAuth, requireRole, syncUserFromRequest, updateUserInDb } from "./auth.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 5000);
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173,http://127.0.0.1:5173").split(",").map((o) => o.trim()).filter(Boolean);

app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 60 * 1000, max: 300 }));

function sendSuccess(res, data = {}, status = 200) {
  return res.status(status).json({ success: true, ...data });
}

function parsePositiveInt(value, fallback) {
  const num = Number(value);
  return Number.isInteger(num) && num >= 0 ? num : fallback;
}

function applyProductProjection(product) {
  return product;
}

function sortByNewest(items) {
  return [...items].sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
}

function getPublicProducts({ featured, showOnHome, limit, skip }) {
  const db = loadDb();
  let products = [...db.products];
  if (featured === true) {
    products = products.filter((product) => product.featured === true || product.showOnHome === true);
  }
  if (showOnHome === true) {
    products = products.filter((product) => product.showOnHome === true);
  }
  products = sortByNewest(products);
  const total = products.length;
  return { total, products: products.slice(skip, skip + limit).map(applyProductProjection) };
}

function normalizeOrder(order) {
  return {
    ...order,
    tracking: Array.isArray(order.tracking) ? order.tracking : [],
  };
}

function enrichOrder(order, db) {
  const product = db.products.find((item) => item._id === order.productId);
  const user = db.users.find((item) => item.email.toLowerCase() === String(order.buyerEmail || "").toLowerCase());
  return {
    ...normalizeOrder(order),
    productName: order.productName || product?.name || "",
    product: product?.name || order.productName || "",
    buyer: order.userName || user?.name || order.buyerEmail || "",
    userName: order.userName || user?.name || "",
    userEmail: order.buyerEmail || user?.email || "",
  };
}

app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok", timestamp: isoNow() });
});

app.get("/api/health", (_req, res) => {
  res.json({ success: true, status: "ok", timestamp: isoNow() });
});

app.get("/api/users/role", requireAuth, (req, res) => {
  const email = String(req.query.email || "");
  if (!email) {
    return res.status(400).json({ success: false, message: "email query parameter is required" });
  }
  const user = getDbUserByEmail(email);
  return res.json({ success: true, role: user?.role || "buyer", user: user ? clone(user) : null });
});

app.get("/api/admin/users", requireAuth, requireRole("admin"), (_req, res) => {
  const db = loadDb();
  return res.json({ success: true, users: sortByNewest(db.users).map(clone) });
});

app.patch("/api/admin/users/:id", requireAuth, requireRole("admin"), (req, res) => {
  const schema = z.object({
    role: z.enum(["buyer", "manager", "admin"]).optional(),
    status: z.enum(["active", "rejected", "suspended"]).optional(),
    suspendReason: z.string().trim().optional(),
    suspendFeedback: z.string().trim().optional(),
  });
  const updates = schema.parse(req.body);
  const updated = updateUserInDb(req.params.id, updates);
  if (!updated) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  return sendSuccess(res, { user: updated });
});

app.get("/api/products", (req, res) => {
  const limit = Math.max(parsePositiveInt(req.query.limit, 8), 1);
  const skip = Math.max(parsePositiveInt(req.query.skip, 0), 0);
  const featured = String(req.query.featured || "false") === "true";
  const showOnHome = String(req.query.showOnHome || "false") === "true";
  return res.json({ success: true, ...getPublicProducts({ featured, showOnHome, limit, skip }) });
});

app.get("/api/products/:id", (req, res) => {
  const db = loadDb();
  const product = db.products.find((item) => item._id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  return res.json({ success: true, product: clone(product) });
});

app.get("/api/admin/products", requireAuth, requireRole("admin"), (_req, res) => {
  const db = loadDb();
  return res.json({ success: true, products: sortByNewest(db.products).map(clone) });
});

app.get("/api/products/my", requireAuth, requireRole("manager", "admin"), (req, res) => {
  const db = loadDb();
  const products = db.products.filter((product) => product.addedByEmail?.toLowerCase() === req.currentUser.email.toLowerCase() || req.currentUser.role === "admin");
  return res.json({ success: true, products: sortByNewest(products).map(clone) });
});

app.post("/api/products", requireAuth, requireRole("manager", "admin"), (req, res) => {
  const schema = z.object({
    name: z.string().min(2),
    category: z.enum(["shirt", "pant", "jacket", "accessories"]),
    description: z.string().min(5),
    price: z.number().nonnegative(),
    availableQuantity: z.number().int().nonnegative(),
    moq: z.number().int().positive(),
    paymentOption: z.string().min(3),
    showOnHome: z.boolean().optional().default(false),
    images: z.array(z.string().min(1)).min(1),
    demoVideoLink: z.string().optional().default(""),
  });
  const payload = schema.parse(req.body);
  const db = loadDb();
  const product = {
    _id: newId("prod"),
    ...payload,
    featured: Boolean(payload.showOnHome),
    addedByEmail: req.currentUser.email,
    createdAt: isoNow(),
    updatedAt: isoNow(),
  };
  db.products.push(product);
  saveDb(db);
  return sendSuccess(res, { product: clone(product) }, 201);
});

app.patch("/api/admin/products/:id", requireAuth, requireRole("admin"), (req, res) => {
  const db = loadDb();
  const product = db.products.find((item) => item._id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  const schema = z.object({
    name: z.string().min(2).optional(),
    category: z.enum(["shirt", "pant", "jacket", "accessories"]).optional(),
    description: z.string().min(5).optional(),
    price: z.number().nonnegative().optional(),
    paymentOption: z.string().min(3).optional(),
    demoVideoLink: z.string().optional(),
    images: z.array(z.string().min(1)).optional(),
    showOnHome: z.boolean().optional(),
  });
  const updates = schema.parse(req.body);
  Object.assign(product, updates, { updatedAt: isoNow() });
  saveDb(db);
  return sendSuccess(res, { product: clone(product) });
});

app.patch("/api/manager/products/:id", requireAuth, requireRole("manager", "admin"), (req, res) => {
  const db = loadDb();
  const product = db.products.find((item) => item._id === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  if (req.currentUser.role !== "admin" && product.addedByEmail?.toLowerCase() !== req.currentUser.email.toLowerCase()) {
    return res.status(403).json({ success: false, message: "You cannot update another manager's product" });
  }
  const schema = z.object({
    name: z.string().min(2).optional(),
    category: z.enum(["shirt", "pant", "jacket", "accessories"]).optional(),
    description: z.string().min(5).optional(),
    price: z.number().nonnegative().optional(),
    paymentOption: z.string().min(3).optional(),
    demoVideoLink: z.string().optional(),
    images: z.array(z.string().min(1)).optional(),
  });
  const updates = schema.parse(req.body);
  Object.assign(product, updates, { updatedAt: isoNow() });
  saveDb(db);
  return sendSuccess(res, { product: clone(product) });
});

app.delete("/api/admin/products/:id", requireAuth, requireRole("admin"), (req, res) => {
  const db = loadDb();
  const index = db.products.findIndex((item) => item._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  const [deleted] = db.products.splice(index, 1);
  saveDb(db);
  return res.json({ success: true, product: clone(deleted) });
});

app.delete("/api/manager/products/:id", requireAuth, requireRole("manager", "admin"), (req, res) => {
  const db = loadDb();
  const index = db.products.findIndex((item) => item._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  const product = db.products[index];
  if (req.currentUser.role !== "admin" && product.addedByEmail?.toLowerCase() !== req.currentUser.email.toLowerCase()) {
    return res.status(403).json({ success: false, message: "You cannot delete another manager's product" });
  }
  db.products.splice(index, 1);
  saveDb(db);
  return res.json({ success: true });
});

app.get("/api/orders", requireAuth, (req, res) => {
  const db = loadDb();
  let orders = db.orders.map((order) => enrichOrder(order, db));
  if (req.query.status) {
    orders = orders.filter((order) => order.status === String(req.query.status));
  }
  if (req.currentUser.role !== "admin" && req.currentUser.role !== "manager") {
    orders = orders.filter((order) => order.buyerEmail?.toLowerCase() === req.currentUser.email.toLowerCase());
  }
  orders = sortByNewest(orders);
  return res.json({ success: true, orders });
});

app.get("/api/orders/my", requireAuth, (req, res) => {
  const db = loadDb();
  const orders = db.orders
    .map((order) => enrichOrder(order, db))
    .filter((order) => order.buyerEmail?.toLowerCase() === req.currentUser.email.toLowerCase());
  return res.json({ success: true, orders: sortByNewest(orders) });
});

app.post("/api/orders", requireAuth, (req, res) => {
  const schema = z.object({
    buyerEmail: z.string().email(),
    productName: z.string().min(2),
    price: z.number().nonnegative(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    quantity: z.coerce.number().int().positive(),
    contactNumber: z.string().min(5),
    address: z.string().min(5),
    notes: z.string().optional().default(""),
    productId: z.string().min(1),
    totalPrice: z.number().nonnegative(),
  });
  const payload = schema.parse(req.body);
  const db = loadDb();
  const product = db.products.find((item) => item._id === payload.productId);
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }
  const order = {
    _id: newId("order"),
    buyerEmail: payload.buyerEmail,
    userName: `${payload.firstName} ${payload.lastName}`.trim(),
    productId: payload.productId,
    productName: payload.productName,
    price: payload.price,
    quantity: payload.quantity,
    totalPrice: payload.totalPrice,
    contactNumber: payload.contactNumber,
    address: payload.address,
    notes: payload.notes || "",
    paymentOption: product.paymentOption,
    status: "pending",
    tracking: [],
    createdAt: isoNow(),
    updatedAt: isoNow(),
  };
  db.orders.push(order);
  product.availableQuantity = Math.max(0, product.availableQuantity - payload.quantity);
  product.updatedAt = isoNow();
  saveDb(db);
  return sendSuccess(res, { order: clone(order) }, 201);
});

app.patch("/api/orders/:id", requireAuth, requireRole("manager", "admin"), (req, res) => {
  const schema = z.object({
    status: z.enum(["pending", "approved", "rejected", "shipped", "delivered"]).optional(),
    approvedAt: z.string().optional(),
  });
  const updates = schema.parse(req.body);
  const db = loadDb();
  const order = db.orders.find((item) => item._id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  Object.assign(order, updates, { updatedAt: isoNow() });
  saveDb(db);
  return sendSuccess(res, { order: clone(order) });
});

app.patch("/api/manager/orders/:id", requireAuth, requireRole("manager", "admin"), (req, res) => {
  const schema = z.object({
    status: z.enum(["pending", "approved", "rejected", "shipped", "delivered"]),
  });
  const updates = schema.parse(req.body);
  const db = loadDb();
  const order = db.orders.find((item) => item._id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  Object.assign(order, updates, { updatedAt: isoNow() });
  saveDb(db);
  return sendSuccess(res, { order: clone(order) });
});

app.post("/api/orders/:id/tracking", requireAuth, requireRole("manager", "admin"), (req, res) => {
  const schema = z.object({
    location: z.string().min(1),
    note: z.string().optional().default(""),
    datetime: z.string().min(1),
    status: z.string().min(1),
  });
  const trackingItem = schema.parse(req.body);
  const db = loadDb();
  const order = db.orders.find((item) => item._id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }
  order.tracking = Array.isArray(order.tracking) ? order.tracking : [];
  order.tracking.push(trackingItem);
  order.status = trackingItem.status.toLowerCase().includes("ship") ? "shipped" : order.status;
  order.updatedAt = isoNow();
  saveDb(db);
  return sendSuccess(res, { order: clone(order) }, 201);
});

app.get("/api/admin/orders", requireAuth, requireRole("admin"), (req, res) => {
  const db = loadDb();
  let orders = db.orders.map((order) => enrichOrder(order, db));
  if (req.query.status) {
    orders = orders.filter((order) => order.status === String(req.query.status));
  }
  const limit = Math.max(parsePositiveInt(req.query.limit, orders.length || 12), 1);
  return res.json({ success: true, orders: sortByNewest(orders).slice(0, limit) });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.path}` });
});

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ success: false, message });
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

