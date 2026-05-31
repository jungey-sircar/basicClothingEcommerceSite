import crypto from "node:crypto";
export function makeSvgDataUri(label, background) {
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
export function buildSeedUsers() {
  const ts = new Date().toISOString();
  return [
    {
      name: "Demo Admin",
      email: "admin@demo.local",
      photoURL: "https://api.dicebear.com/9.x/initials/svg?seed=Admin",
      role: "admin",
      status: "active",
      createdAt: ts,
      updatedAt: ts,
    },
    {
      name: "Demo Manager",
      email: "manager@demo.local",
      photoURL: "https://api.dicebear.com/9.x/initials/svg?seed=Manager",
      role: "manager",
      status: "active",
      createdAt: ts,
      updatedAt: ts,
    },
    {
      name: "Demo Buyer",
      email: "buyer@demo.local",
      photoURL: "https://api.dicebear.com/9.x/initials/svg?seed=Buyer",
      role: "buyer",
      status: "active",
      createdAt: ts,
      updatedAt: ts,
    },
  ];
}
export function buildSeedProducts() {
  const ts = new Date().toISOString();
  return [
    {
      name: "Classic Cotton Shirt",
      category: "shirt",
      description: "A breathable cotton shirt for everyday office and casual wear.",
      price: 24,
      availableQuantity: 250,
      moq: 10,
      paymentOption: "Cash on Delivery",
      images: [makeSvgDataUri("Cotton Shirt", "#4f46e5")],
      demoVideoLink: "",
      showOnHome: true,
      featured: true,
      addedByEmail: "manager@demo.local",
      createdAt: ts,
      updatedAt: ts,
    },
    {
      name: "Modern Utility Jacket",
      category: "jacket",
      description: "A lightweight jacket with clean lines and production-ready stitching.",
      price: 58,
      availableQuantity: 120,
      moq: 5,
      paymentOption: "Pay First",
      images: [makeSvgDataUri("Utility Jacket", "#0f766e")],
      demoVideoLink: "",
      showOnHome: true,
      featured: true,
      addedByEmail: "manager@demo.local",
      createdAt: ts,
      updatedAt: ts,
    },
    {
      name: "Slim Fit Denim Pant",
      category: "pant",
      description: "Durable denim pants with a slim fit and premium finishing.",
      price: 31,
      availableQuantity: 180,
      moq: 8,
      paymentOption: "Cash on Delivery",
      images: [makeSvgDataUri("Denim Pant", "#7c3aed")],
      demoVideoLink: "",
      showOnHome: false,
      featured: false,
      addedByEmail: "manager@demo.local",
      createdAt: ts,
      updatedAt: ts,
    },
    {
      name: "Leather Belt Set",
      category: "accessories",
      description: "A compact belt set for retail bundles and gift packs.",
      price: 12,
      availableQuantity: 500,
      moq: 20,
      paymentOption: "Pay First",
      images: [makeSvgDataUri("Belt Set", "#b45309")],
      demoVideoLink: "",
      showOnHome: false,
      featured: false,
      addedByEmail: "manager@demo.local",
      createdAt: ts,
      updatedAt: ts,
    },
  ];
}
const __keep = [makeSvgDataUri, buildSeedUsers, buildSeedProducts, crypto];
void __keep;
