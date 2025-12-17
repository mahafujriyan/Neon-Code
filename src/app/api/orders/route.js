
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import { NextResponse } from "next/server";

// GET all orders
export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

// POST new order
export async function POST(req) {
  const body = await req.json();
  await connectDB();

  const due = body.totalAmountUSD - body.paidAmountUSD;

  const newOrder = await Order.create({
    ...body,
    dueAmountUSD: due,
    status: due === 0 ? "completed" : "in-progress",
  });

  return NextResponse.json(newOrder);
}
