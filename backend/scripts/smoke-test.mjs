import { MongoMemoryServer } from "mongodb-memory-server";
const authHeaders = {
  Authorization: "Bearer eyJhbGciOiJub25lIn0.eyJlbWFpbCI6ImFkbWluQGRlbW8ubG9jYWwiLCJuYW1lIjoiRGVtbyBBZG1pbiIsInBpY3R1cmUiOiJodHRwczovL2FwaS5kaWNlYmVhci5jb20vOS54L2luaXRpYWxzL3N2Zz9zZWVkPUFkbWluIn0.",
  "Content-Type": "application/json",
};
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
async function request(baseUrl, path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { ...(options.headers || {}) },
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { status: res.status, body };
}
const mongo = await MongoMemoryServer.create();
const port = Number(process.env.PORT || 5055);
const baseUrl = `http://127.0.0.1:${port}`;
process.env.MONGODB_URI = mongo.getUri("garments-test");
process.env.PORT = String(port);
const { startServer } = await import("../src/server.js");
const server = await startServer(port);
try {
  const health = await request(baseUrl, "/health");
  assert(health.status === 200, "health check failed");
  const products = await request(baseUrl, "/api/products?limit=2&skip=0");
  assert(products.status === 200, "products list failed");
  assert(Array.isArray(products.body.products), "products list payload invalid");
  const featured = await request(baseUrl, "/api/products?featured=true&limit=2");
  assert(featured.status === 200, "featured products failed");
  const role = await request(baseUrl, "/api/users/role?email=admin%40demo.local", { headers: authHeaders });
  assert(role.status === 200, "role lookup failed");
  assert(role.body.role === "admin", "role lookup returned wrong role");
  const dbState = await request(baseUrl, "/api/debug/db-state", { headers: authHeaders });
  assert(dbState.status === 200, "db state check failed");
  assert(dbState.body.counts.users >= 1, "user count missing");
  console.log("Smoke test passed");
} finally {
  await new Promise((resolve) => server.close(resolve));
  await mongo.stop();
}
