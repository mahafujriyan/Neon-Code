import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import User from "@/models/User";
import { NextResponse } from "next/server";

/* =========================
   GET → Admin: all
         Manager: own
========================= */
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
      user.role === "admin"
        ? {}
        : { createdByEmail: email };

    const expenses = await Expense.find(query).sort({
      createdAt: -1,
    });

    return NextResponse.json(expenses);
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/* =========================
   POST → Add Expense
   Manager → pending
========================= */
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const expense = await Expense.create({
      ...body,
      status: "pending",
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

/* =========================
   PUT → Admin Approve
========================= */
export async function PUT(req) {
  try {
    await connectDB();
    const { id, status, approvedBy } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID & status required" },
        { status: 400 }
      );
    }

    const updated = await Expense.findByIdAndUpdate(
      id,
      {
        status,
        approvedBy: approvedBy || "admin",
        approvedAt: new Date(),
      },
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
   DELETE → Admin Only
========================= */
export async function DELETE(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email")?.toLowerCase();

    if (!id || !email) {
      return NextResponse.json(
        { error: "ID & Email required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin only action" },
        { status: 403 }
      );
    }

    await Expense.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Expense deleted successfully",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
