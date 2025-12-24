import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ["admin", "manager"], default: "manager" },
  name: String
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// --- GET Method (ইউজার ডাটা দেখার জন্য) ---
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email missing" }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// --- POST Method (লগইন বা সাইনআপের সময় ইউজার আপডেট/তৈরি) ---
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { email, name } = body;
    
    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // ইউজার থাকলে আপডেট করবে, না থাকলে নতুন তৈরি করবে (upsert)
    const user = await User.findOneAndUpdate(
      { email }, 
      { $set: { name }, $setOnInsert: { role: "manager" } }, 
      { upsert: true, new: true }
    );
    return NextResponse.json(user);
  } catch (err) { 
    return NextResponse.json({ error: err.message }, { status: 500 }); 
  }
}