import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    category: { type: String, required: true, enum: ["shirt", "pant", "jacket", "accessories"], index: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    availableQuantity: { type: Number, required: true, min: 0 },
    moq: { type: Number, required: true, min: 1 },
    paymentOption: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    demoVideoLink: { type: String, default: "" },
    showOnHome: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
    addedByEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
  },
  { timestamps: true }
);
export default mongoose.models.Product || mongoose.model("Product", productSchema);
