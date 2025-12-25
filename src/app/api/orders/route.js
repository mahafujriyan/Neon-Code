import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { User } from "@/models/User";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// ১. ডাটা দেখা (GET)
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await User.findOne({ email });
    const role = user?.role || "manager";
    
    let query = role === "admin" ? {} : { managerEmail: email };
    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ২. নতুন অর্ডার তৈরি (POST)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const newOrder = await Order.create(body);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ৩. ডাটা আপডেট করা (PUT)
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Valid ID missing" }, { status: 400 });
    }

    const updated = await Order.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ৪. ডাটা ডিলিট করা (DELETE - FULLY FIXED)
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email")?.toLowerCase();

    // অ্যাডমিন চেক
    const adminUser = await User.findOne({ email });
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized: Admin Only" }, { status: 403 });
    }

    // আইডি চেক এবং ডিলিট
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const deleted = await Order.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}