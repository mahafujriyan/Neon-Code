import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb"; // পাথ ফিক্স করা হয়েছে
import Design from "@/models/Design";

// ১. ডাটা রিট্রিভ করা (GET)
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    // যদি clientId থাকে, তবে ওই নির্দিষ্ট ক্লায়েন্টের ডাটা খুঁজবে
    if (clientId) {
      const existingClient = await Design.findOne({ clientId: clientId }).sort({ createdAt: -1 });
      return NextResponse.json(existingClient || null);
    }

    // অন্যথায় সব ডাটা সিরিয়ালি রিটার্ন করবে
    const designs = await Design.find({}).sort({ createdAt: -1 });
    return NextResponse.json(designs);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ২. নতুন ডিজাইন এন্ট্রি তৈরি করা (POST)
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    
    // ব্যাকএন্ডে পুনরায় ক্যালকুলেশন নিশ্চিত করা
    const total = Number(body.totalTasks) || 0;
    const complete = Number(body.completeTasks) || 0;
    const success = Number(body.successCount) || 0;

    const cleanData = {
      ...body,
      totalTasks: total,
      completeTasks: complete,
      pendingTasks: total - complete, 
      successCount: success,
      rejectCount: complete - success, 
      status: "pending", 
    };

    const newDesign = await Design.create(cleanData);
    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json({ error: "Client ID already exists!" }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ৩. আপডেট করা বা এপ্রুভ করা (PUT)
export async function PUT(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    const total = Number(updateData.totalTasks) || 0;
    const complete = Number(updateData.completeTasks) || 0;
    const success = Number(updateData.successCount) || 0;

    const finalUpdate = {
      ...updateData,
      totalTasks: total,
      completeTasks: complete,
      pendingTasks: total - complete,
      successCount: success,
      rejectCount: complete - success,
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

// ৪. ডিলিট করা (DELETE)
export async function DELETE(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

    await Design.findByIdAndDelete(id);
    return NextResponse.json({ message: "Record deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}