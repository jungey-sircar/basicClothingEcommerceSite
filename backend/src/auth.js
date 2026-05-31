import { clone, isoNow, loadDb, saveDb, newId } from "./store.js";

function base64UrlDecode(input) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function decodeJwtPayload(token) {
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    return JSON.parse(base64UrlDecode(parts[1]));
  } catch {
    return null;
  }
}

export function getIdentity(req) {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7).trim();
    const payload = decodeJwtPayload(token);
    if (payload?.email) {
      return {
        email: payload.email,
        name: payload.name || payload.email.split("@")[0],
        photoURL: payload.picture || "",
        uid: payload.user_id || payload.sub || payload.uid || payload.email,
        token,
      };
    }
  }

  const devEmail = req.headers["x-dev-email"];
  if (typeof devEmail === "string" && devEmail.trim()) {
    return {
      email: devEmail.trim(),
      name: req.headers["x-dev-name"]?.toString()?.trim() || devEmail.split("@")[0],
      photoURL: req.headers["x-dev-photo-url"]?.toString()?.trim() || "",
      uid: req.headers["x-dev-uid"]?.toString()?.trim() || devEmail.trim(),
      token: null,
    };
  }

  return null;
}

export function syncUserFromRequest(req) {
  const identity = getIdentity(req);
  if (!identity) return null;

  const db = loadDb();
  const existing = db.users.find((user) => user.email.toLowerCase() === identity.email.toLowerCase());
  const ts = isoNow();

  if (!existing) {
    const created = {
      _id: newId("user"),
      name: identity.name,
      email: identity.email,
      photoURL: identity.photoURL,
      role: "buyer",
      status: "active",
      createdAt: ts,
      updatedAt: ts,
    };
    db.users.push(created);
    saveDb(db);
    return created;
  }

  let changed = false;
  if (identity.name && existing.name !== identity.name) {
    existing.name = identity.name;
    changed = true;
  }
  if (identity.photoURL && existing.photoURL !== identity.photoURL) {
    existing.photoURL = identity.photoURL;
    changed = true;
  }
  if (changed) {
    existing.updatedAt = ts;
    saveDb(db);
  }
  return existing;
}

export function requireAuth(req, res, next) {
  const user = syncUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  if (user.status === "suspended") {
    return res.status(403).json({ success: false, message: "User is suspended" });
  }
  req.currentUser = user;
  return next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    const user = req.currentUser || syncUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ success: false, message: "User is suspended" });
    }
    if (!roles.includes(user.role) && user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Insufficient permissions" });
    }
    req.currentUser = user;
    return next();
  };
}

export function getDbUserByEmail(email) {
  const db = loadDb();
  return db.users.find((user) => user.email.toLowerCase() === String(email || "").toLowerCase()) || null;
}

export function updateUserInDb(userId, updates) {
  const db = loadDb();
  const user = db.users.find((item) => item._id === userId);
  if (!user) return null;
  Object.assign(user, updates, { updatedAt: isoNow() });
  saveDb(db);
  return clone(user);
}

