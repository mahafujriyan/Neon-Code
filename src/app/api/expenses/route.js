import { connectDB } from "@/lib/mongodb";
import Expense from "@/models/Expense";
import User from "@/models/User";
import { NextResponse } from "next/server";

// আপনার GET ফাংশনের এই অংশটুকু পরিবর্তন করুন
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase();

    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ✅ এখানে পরিবর্তন: অ্যাডমিন হোক বা ইউজার, সবাই সব ডাটা {} দেখতে পাবে
    const query = {}; 
    const expenses = await Expense.find(query).sort({ createdAt: -1 });

    return NextResponse.json(expenses);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const expense = await Expense.create({ ...body, status: "pending" });
    return NextResponse.json(expense, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, isUpdate, status, approvedBy } = body;

    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    let updateData;

    if (isUpdate) {
      // ✏️ এডিট লজিক: ম্যানেজার বা অ্যাডমিন ডাটা পরিবর্তন করলে
      updateData = {
        expenseType: body.expenseType,
        category: body.category,
        employeeName: body.employeeName,
        reason: body.reason,
        amount: Number(body.amount),
        status: "pending", // এডিট করলে আবার পেন্ডিং হবে
      };
    } else {
      // ✅ অ্যাপ্রুভ লজিক: অ্যাডমিন যখন স্ট্যাটাস চেঞ্জ করবে
      updateData = {
        status: status,
        approvedBy: approvedBy || "admin",
        approvedAt: new Date(),
      };
    }

    const updated = await Expense.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const email = searchParams.get("email")?.toLowerCase();

    const user = await User.findOne({ email });
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin only action" }, { status: 403 });
    }

    await Expense.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}