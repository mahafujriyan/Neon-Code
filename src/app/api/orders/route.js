import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { NextResponse } from "next/server";

// ১. ডাটা রিড করার জন্য (GET)
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase();
    const phoneQuery = searchParams.get("phone");

    if (!email) return NextResponse.json({ error: "Email missing" }, { status: 400 });

    const user = await User.findOne({ email: email });
    const userRole = user?.role ? user.role.toLowerCase() : "manager";

    let query = userRole === "admin" ? {} : { managerEmail: email };

    if (phoneQuery) {
      query.phone = { $regex: phoneQuery, $options: "i" };
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ২. নতুন ডাটা সেভ করার জন্য (POST)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.managerEmail) {
      return NextResponse.json({ error: "Manager Email is required" }, { status: 400 });
    }

    const newOrder = await Order.create(body);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ৩. ডাটা আপডেট বা এডিট করার জন্য (PUT)
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: "Order ID missing" }, { status: 400 });

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updatedOrder);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}