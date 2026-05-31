import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { z } from "zod";
import { pathToFileURL } from "node:url";
import { connectDatabase } from "./db.js";
import { seedDatabase } from "./seed.js";
import User from "./models/User.js";
import Product from "./models/Product.js";
import Order from "./models/Order.js";
import { getDbUserByEmail, requireAuth, requireRole, updateUserInDb } from "./auth.js";
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
function sortByNewest(items) {
  return [...items].sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
}
function toPlain(doc) {
  return doc?.toObject ? doc.toObject() : doc;
}
function makeOrderView(order) {
  const plain = toPlain(order);
  return {
    ...plain,
    tracking: Array.isArray(plain.tracking) ? plain.tracking : [],
    buyer: plain.userName || plain.buyerEmail || "",
    userName: plain.userName || "",
    userEmail: plain.buyerEmail || "",
    product: plain.productName || "",
    productName: plain.productName || "",
  };
}
app.get("/health", (_req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});
app.get("/api/health", (_req, res) => {
  res.json({ success: true, status: "ok", timestamp: new Date().toISOString() });
});
app.get("/api/users/role", requireAuth, async (req, res, next) => {
  try {
    const email = String(req.query.email || "");
    if (!email) {
      return res.status(400).json({ success: false, message: "email query parameter is required" });
    }
    const user = await getDbUserByEmail(email);
    return res.json({ success: true, role: user?.role || "buyer", user: user || null });
  } catch (error) {
    return next(error);
  }
});
app.get("/api/admin/users", requireAuth, requireRole("admin"), async (_req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, users });
  } catch (error) {
    return next(error);
  }
});
app.patch("/api/admin/users/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const schema = z.object({
      role: z.enum(["buyer", "manager", "admin"]).optional(),
      status: z.enum(["active", "rejected", "suspended"]).optional(),
      suspendReason: z.string().trim().optional(),
      suspendFeedback: z.string().trim().optional(),
    });
    const updates = schema.parse(req.body);
    const updated = await updateUserInDb(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return sendSuccess(res, { user: updated });
  } catch (error) {
    return next(error);
  }
});
app.get("/api/products", async (req, res, next) => {
  try {
    const limit = Math.max(parsePositiveInt(req.query.limit, 8), 1);
    const skip = Math.max(parsePositiveInt(req.query.skip, 0), 0);
    const featured = String(req.query.featured || "false") === "true";
    const showOnHome = String(req.query.showOnHome || "false") === "true";
    const filter = {};
    if (featured) {
      filter.$or = [{ featured: true }, { showOnHome: true }];
    }
    if (showOnHome) {
      filter.showOnHome = true;
    }
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);
    return res.json({ success: true, total, products });
  } catch (error) {
    return next(error);
  }
});
app.get("/api/products/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.json({ success: true, product });
  } catch (error) {
    return next(error);
  }
});
app.get("/api/admin/products", requireAuth, requireRole("admin"), async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, products });
  } catch (error) {
    return next(error);
  }
});
app.get("/api/products/my", requireAuth, requireRole("manager", "admin"), async (req, res, next) => {
  try {
    const products = await Product.find(
      req.currentUser.role === "admin" ? {} : { addedByEmail: req.currentUser.email.toLowerCase() }
    ).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, products });
  } catch (error) {
    return next(error);
  }
});
app.post("/api/products", requireAuth, requireRole("manager", "admin"), async (req, res, next) => {
  try {
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
    const product = await Product.create({
      ...payload,
      featured: Boolean(payload.showOnHome),
      addedByEmail: req.currentUser.email,
    });
    return sendSuccess(res, { product: product.toObject() }, 201);
  } catch (error) {
    return next(error);
  }
});
app.patch("/api/admin/products/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
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
    const product = await Product.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return sendSuccess(res, { product: product.toObject() });
  } catch (error) {
    return next(error);
  }
});
app.patch("/api/manager/products/:id", requireAuth, requireRole("manager", "admin"), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (req.currentUser.role !== "admin" && product.addedByEmail !== req.currentUser.email.toLowerCase()) {
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
    Object.assign(product, updates);
    await product.save();
    return sendSuccess(res, { product: product.toObject() });
  } catch (error) {
    return next(error);
  }
});
app.delete("/api/admin/products/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    return res.json({ success: true, product: deleted.toObject() });
  } catch (error) {
    return next(error);
  }
});
app.delete("/api/manager/products/:id", requireAuth, requireRole("manager", "admin"), async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    if (req.currentUser.role !== "admin" && product.addedByEmail !== req.currentUser.email.toLowerCase()) {
      return res.status(403).json({ success: false, message: "You cannot delete another manager's product" });
    }
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch (error) {
    return next(error);
  }
});
app.get("/api/orders", requireAuth, async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = String(req.query.status);
    }
    if (req.currentUser.role !== "admin" && req.currentUser.role !== "manager") {
      query.buyerEmail = req.currentUser.email.toLowerCase();
    }
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, orders: orders.map(makeOrderView) });
  } catch (error) {
    return next(error);
  }
});
app.get("/api/orders/my", requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ buyerEmail: req.currentUser.email.toLowerCase() }).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, orders: orders.map(makeOrderView) });
  } catch (error) {
    return next(error);
  }
});
app.post("/api/orders", requireAuth, async (req, res, next) => {
  try {
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
    const product = await Product.findById(payload.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    const order = await Order.create({
      buyerEmail: payload.buyerEmail.toLowerCase(),
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
    });
    product.availableQuantity = Math.max(0, product.availableQuantity - payload.quantity);
    await product.save();
    return sendSuccess(res, { order: order.toObject() }, 201);
  } catch (error) {
    return next(error);
  }
});
app.patch("/api/orders/:id", requireAuth, requireRole("manager", "admin"), async (req, res, next) => {
  try {
    const schema = z.object({
      status: z.enum(["pending", "approved", "rejected", "shipped", "delivered"]).optional(),
      approvedAt: z.string().optional(),
    });
    const updates = schema.parse(req.body);
    if (updates.approvedAt) updates.approvedAt = new Date(updates.approvedAt);
    const order = await Order.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return sendSuccess(res, { order: order.toObject() });
  } catch (error) {
    return next(error);
  }
});
app.patch("/api/manager/orders/:id", requireAuth, requireRole("manager", "admin"), async (req, res, next) => {
  try {
    const schema = z.object({
      status: z.enum(["pending", "approved", "rejected", "shipped", "delivered"]),
    });
    const updates = schema.parse(req.body);
    const order = await Order.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    return sendSuccess(res, { order: order.toObject() });
  } catch (error) {
    return next(error);
  }
});
app.post("/api/orders/:id/tracking", requireAuth, requireRole("manager", "admin"), async (req, res, next) => {
  try {
    const schema = z.object({
      location: z.string().min(1),
      note: z.string().optional().default(""),
      datetime: z.string().min(1),
      status: z.string().min(1),
    });
    const trackingItem = schema.parse(req.body);
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    order.tracking.push({ ...trackingItem, datetime: new Date(trackingItem.datetime) });
    order.status = trackingItem.status.toLowerCase().includes("ship") ? "shipped" : order.status;
    await order.save();
    return sendSuccess(res, { order: order.toObject() }, 201);
  } catch (error) {
    return next(error);
  }
});
app.get("/api/admin/orders", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = String(req.query.status);
    }
    const limit = Math.max(parsePositiveInt(req.query.limit, 12), 1);
    const orders = await Order.find(query).sort({ createdAt: -1 }).limit(limit).lean();
    return res.json({ success: true, orders: orders.map(makeOrderView) });
  } catch (error) {
    return next(error);
  }
});
app.get("/api/manager/orders", requireAuth, requireRole("manager", "admin"), async (req, res, next) => {
  try {
    const query = {};
    if (req.query.status) {
      query.status = String(req.query.status);
    }
    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    return res.json({ success: true, orders: orders.map(makeOrderView) });
  } catch (error) {
    return next(error);
  }
});
app.get("/api/me", requireAuth, (req, res) => {
  return res.json({ success: true, user: req.currentUser });
});
app.patch("/api/me", requireAuth, async (req, res, next) => {
  try {
    const schema = z.object({
      name: z.string().min(1).optional(),
      photoURL: z.string().url().optional().or(z.literal("")),
    });
    const updates = schema.parse(req.body);
    const updated = await updateUserInDb(req.currentUser._id, updates);
    return sendSuccess(res, { user: updated });
  } catch (error) {
    return next(error);
  }
});
app.post("/api/users/sync", requireAuth, (req, res) => {
  return sendSuccess(res, { user: req.currentUser }, 200);
});
app.get("/api/debug/db-state", async (_req, res, next) => {
  try {
    const [users, products, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ]);
    return res.json({ success: true, counts: { users, products, orders } });
  } catch (error) {
    return next(error);
  }
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
export async function startServer(listenPort = port) {
  await connectDatabase();
  await seedDatabase();
  return app.listen(listenPort, () => {
    console.log(`Backend running at http://localhost:${listenPort}`);
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer(port).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
export default app;
