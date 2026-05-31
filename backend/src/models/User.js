import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    photoURL: { type: String, default: "" },
    role: { type: String, enum: ["buyer", "manager", "admin"], default: "buyer", index: true },
    status: { type: String, enum: ["active", "rejected", "suspended"], default: "active", index: true },
    suspendReason: { type: String, default: "" },
    suspendFeedback: { type: String, default: "" },
  },
  { timestamps: true }
);
export default mongoose.models.User || mongoose.model("User", userSchema);
