import { connectDB } from "@/lib/mongodb";
import Payment from "@/models/Payment";
import { NextResponse } from "next/server";

/* =========================
   GET – Payments by Order
========================= */
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    const payments = await Payment.find({ orderId }).sort({
      paymentDate: -1,
    });

    return NextResponse.json(payments);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/* =========================
   POST – Add Payment
========================= */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const payment = await Payment.create(body);
    return NextResponse.json(payment);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/* =========================
   PUT – Update Payment
========================= */
export async function PUT(req) {
  try {
    await connectDB();
    const { id, ...data } = await req.json();

    const updated = await Payment.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE – Remove Payment
========================= */
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await Payment.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
