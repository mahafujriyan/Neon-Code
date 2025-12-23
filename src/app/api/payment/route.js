import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { NextResponse } from "next/server";

export async function GET(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get("orderId");
  const payments = await Payment.find({ orderId });
  return NextResponse.json(payments);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const payment = await Payment.create({
    ...body,
    paidBDT: body.paidUSD * body.dollarRate,
  });

  return NextResponse.json(payment);
}

export async function PUT(req) {
  await connectDB();
  const { id, ...data } = await req.json();
  const updated = await Payment.findByIdAndUpdate(id, data, { new: true });
  return NextResponse.json(updated);
}

export async function DELETE(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  await Payment.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
