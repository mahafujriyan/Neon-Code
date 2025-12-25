import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ["admin", "manager"], default: "manager" },
}, { timestamps: true });

// ডুপ্লিকেট মডেল রেজিস্ট্রেশন এড়াতে এই চেকটি জরুরি
export const User = mongoose.models.User || mongoose.model("User", UserSchema);