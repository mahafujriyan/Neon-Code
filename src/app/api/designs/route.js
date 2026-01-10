import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Design from "@/models/Design";

// ১. ডাটা রিট্রিভ করা (GET)
export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");

    if (clientId) {
      const existingClient = await Design.findOne({ clientId: clientId }).sort({ createdAt: -1 });
      return NextResponse.json(existingClient || null);
    }

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
    
    const total = Number(body.totalTasks) || 0;
    const complete = Number(body.completeTasks) || 0;
    const success = Number(body.successCount) || 0;

    const cleanData = {
      ...body,
      folderLink: body.folderLink || body.imageUrl || "",
      totalTasks: total,
      completeTasks: complete,
      pendingTasks: total - complete, 
      successCount: success,
      rejectCount: complete - success, 
      status: body.status || "pending", 
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
    
    // ফ্রন্টএন্ড থেকে _id বা id যেকোনো একটা আসতে পারে, সেটা রিসিভ করা
    const targetId = body._id || body.id;

    if (!targetId) {
      return NextResponse.json({ error: "ID (_id or id) is required for update" }, { status: 400 });
    }

    // ক্যালকুলেশন ফিল্ডগুলো আলাদা করা
    const total = Number(body.totalTasks) || 0;
    const complete = Number(body.completeTasks) || 0;
    const success = Number(body.successCount) || 0;

    // বডি থেকে অপ্রয়োজনীয় আইডি ফিল্ড বাদ দিয়ে বাকি ডাটা নেয়া
    const { _id, id, ...updateData } = body;

    const finalUpdate = {
      folderLink: body.folderLink || body.imageUrl || "",
      ...updateData,
      totalTasks: total,
      completeTasks: complete,
      pendingTasks: total - complete,
      successCount: success,
      rejectCount: complete - success,
    };

    const updatedDesign = await Design.findByIdAndUpdate(
      targetId,
      { $set: finalUpdate }, 
      { new: true, runValidators: true }
    );

    if (!updatedDesign) {
      return NextResponse.json({ error: "No record found with this ID" }, { status: 404 });
    }

    return NextResponse.json(updatedDesign);
  } catch (error) {
    console.error("Update Error:", error);
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