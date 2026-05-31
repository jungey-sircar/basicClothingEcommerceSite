import mongoose from "mongoose";

const trackingSchema = new mongoose.Schema(
  {
    location: { type: String, required: true, trim: true },
    note: { type: String, default: "" },
    datetime: { type: Date, required: true },
    status: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    buyerEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    userName: { type: String, required: true, trim: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    productName: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    contactNumber: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    notes: { type: String, default: "" },
    paymentOption: { type: String, required: true, trim: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "shipped", "delivered"], default: "pending", index: true },
    approvedAt: { type: Date },
    tracking: { type: [trackingSchema], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);

