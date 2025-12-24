import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ["admin", "manager"], default: "manager" },
  name: String
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export async function POST(req) {
  try {
    await connectDB();
    const { email, name } = await req.json();
    
    // ইউজার থাকলে আপডেট করবে, না থাকলে নতুন তৈরি করবে। 
    // গুরুত্বপূর্ণ: role: "manager" শুধুমাত্র নতুন ইউজারের জন্য ($setOnInsert)
    const user = await User.findOneAndUpdate(
      { email }, 
      { 
        $set: { name }, 
        $setOnInsert: { role: "manager" } 
      }, 
      { upsert: true, new: true }
    );
    return NextResponse.json(user);
  } catch (err) { 
    return NextResponse.json({ error: err.message }, { status: 500 }); 
  }
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const user = await User.findOne({ email });
    // যদি ইউজার ডাটাবেজে না থাকে, তবে ডিফল্ট ম্যানেজার রোল পাঠাবে
    return NextResponse.json(user || { role: "manager" });
  } catch (err) { 
    return NextResponse.json({ error: err.message }, { status: 500 }); 
  }
}