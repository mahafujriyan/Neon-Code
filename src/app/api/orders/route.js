import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();
    
    // URL থেকে email এবং role সংগ্রহ করা
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const role = searchParams.get("role");

    // যদি ইমেইল না থাকে, তবে সিকিউরিটির জন্য খালি অ্যারে পাঠানো
    if (!email) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    let query = {};

    // লজিক: যদি ইউজার এডমিন না হয়, তবে শুধু তার নিজের managerEmail চেক করবে
    if (role !== "admin") {
      query = { managerEmail: email }; 
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    // ডাটাবেজে সেভ করার আগে নিশ্চিত করা হচ্ছে যেন managerEmail থাকে
    if (!body.managerEmail) {
      return NextResponse.json({ error: "Manager email is required to save order" }, { status: 400 });
    }

    const newOrder = await Order.create(body);
    return NextResponse.json(newOrder);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}