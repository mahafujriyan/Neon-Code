import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  role: { type: String, enum: ["admin", "manager"], default: "manager" },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", UserSchema);