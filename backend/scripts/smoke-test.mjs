const baseUrl = process.env.SMOKE_URL || "http://localhost:5000";
const authHeaders = {
  Authorization: "Bearer eyJhbGciOiJub25lIn0.eyJlbWFpbCI6ImFkbWluQGRlbW8ubG9jYWwiLCJuYW1lIjoiRGVtbyBBZG1pbiIsInBpY3R1cmUiOiJodHRwczovL2FwaS5kaWNlYmVhci5jb20vOS54L2luaXRpYWxzL3N2Zz9zZWVkPUFkbWluIn0.",
  "Content-Type": "application/json",
};

async function request(path, options = {}) {
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

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const health = await request("/health");
assert(health.status === 200, "health check failed");

const products = await request("/api/products?limit=2&skip=0");
assert(products.status === 200, "products list failed");
assert(Array.isArray(products.body.products), "products list payload invalid");

const featured = await request("/api/products?featured=true&limit=2");
assert(featured.status === 200, "featured products failed");

const role = await request("/api/users/role?email=admin%40demo.local", { headers: authHeaders });
assert(role.status === 200, "role lookup failed");
assert(role.body.role === "admin", "role lookup returned wrong role");

console.log("Smoke test passed");

