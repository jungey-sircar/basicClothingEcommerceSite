import User from "./models/User.js";
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
        email: payload.email.toLowerCase(),
        name: payload.name || payload.email.split("@")[0],
        photoURL: payload.picture || "",
        uid: payload.user_id || payload.sub || payload.uid || payload.email,
      };
    }
  }
  const devEmail = req.headers["x-dev-email"];
  if (typeof devEmail === "string" && devEmail.trim()) {
    return {
      email: devEmail.trim().toLowerCase(),
      name: req.headers["x-dev-name"]?.toString()?.trim() || devEmail.split("@")[0],
      photoURL: req.headers["x-dev-photo-url"]?.toString()?.trim() || "",
      uid: req.headers["x-dev-uid"]?.toString()?.trim() || devEmail.trim(),
    };
  }
  return null;
}
async function ensureUser(identity) {
  const filter = { email: identity.email };
  const update = {
    $set: {
      ...(identity.name ? { name: identity.name } : {}),
      ...(identity.photoURL ? { photoURL: identity.photoURL } : {}),
    },
    $setOnInsert: {
      email: identity.email,
      role: "buyer",
      status: "active",
    },
  };
  const user = await User.findOneAndUpdate(filter, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
  });
  return user?.toObject();
}
export async function syncUserFromRequest(req) {
  const identity = getIdentity(req);
  if (!identity) return null;
  return ensureUser(identity);
}
export async function getDbUserByEmail(email) {
  if (!email) return null;
  return User.findOne({ email: String(email).toLowerCase() }).lean();
}
export async function updateUserInDb(userId, updates) {
  const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });
  return user?.toObject() || null;
}
export async function requireAuth(req, res, next) {
  try {
    const user = await syncUserFromRequest(req);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (user.status === "suspended") {
      return res.status(403).json({ success: false, message: "User is suspended" });
    }
    req.currentUser = user;
    return next();
  } catch (error) {
    return next(error);
  }
}
export function requireRole(...roles) {
  return async (req, res, next) => {
    try {
      const user = req.currentUser || (await syncUserFromRequest(req));
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
    } catch (error) {
      return next(error);
    }
  };
}
const __keep = [getIdentity, syncUserFromRequest, getDbUserByEmail, updateUserInDb, requireAuth, requireRole];
void __keep;
