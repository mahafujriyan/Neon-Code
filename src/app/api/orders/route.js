import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const orders = await Order.find().sort({ createdAt: -1 });
  return NextResponse.json(orders);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const order = await Order.create(body);
  return NextResponse.json(order);
}
