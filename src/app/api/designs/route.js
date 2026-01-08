import { connectDB } from "@/lib/mongodb";
import Design from "@/models/Design";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const designs = await Design.find({}).sort({ createdAt: -1 });
    return NextResponse.json(designs);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const now = new Date();
    
    // ডাটা সেভ করার আগে নাম্বার টাইপ নিশ্চিত করা
    const cleanData = {
      ...body,
      totalTasks: Number(body.totalTasks) || 0,
      completeTasks: Number(body.completeTasks) || 0,
      pendingTasks: Number(body.pendingTasks) || 0,
      successCount: Number(body.successCount) || 0,
      rejectCount: Number(body.rejectCount) || 0,
      submittedDate: now.toISOString().split("T")[0],
      submittedTime: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newDesign = await Design.create(cleanData);
    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    // এডিট করার সময়ও নাম্বার টাইপ নিশ্চিত করা
    const finalUpdate = {
      ...updateData,
      totalTasks: Number(updateData.totalTasks) || 0,
      completeTasks: Number(updateData.completeTasks) || 0,
      pendingTasks: Number(updateData.pendingTasks) || 0,
      successCount: Number(updateData.successCount) || 0,
      rejectCount: Number(updateData.rejectCount) || 0,
    };

    const updatedDesign = await Design.findByIdAndUpdate(
      id,
      { $set: finalUpdate }, 
      { new: true }
    );

    return NextResponse.json(updatedDesign);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const id = new URL(req.url).searchParams.get("id");
    await Design.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}