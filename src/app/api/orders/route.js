import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import User from "@/models/User";
import { NextResponse } from "next/server";

/* ================= GET ================= */
export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const query =
      user.role === "admin" ? {} : { managerEmail: email };

    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("GET ORDERS ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/* ================= POST ================= */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const order = await Order.create(body);

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/* ================= PUT ================= */
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Order ID required" },
        { status: 400 }
      );
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (err) {
    console.error("UPDATE ORDER ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/* ================= DELETE ================= */
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");
    const email = searchParams.get("email")?.toLowerCase();

    if (!id || !email) {
      return NextResponse.json(
        { error: "ID and Email required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access only" },
        { status: 403 }
      );
    }

    await Order.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE ORDER ERROR:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
