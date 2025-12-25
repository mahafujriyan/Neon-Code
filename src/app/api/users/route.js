import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { email, name } = await req.json();
    // ইউজার থাকলে আপডেট হবে, না থাকলে নতুন তৈরি হবে (Upsert)
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { name }, $setOnInsert: { role: "manager" } },
      { upsert: true, new: true }
    );
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}