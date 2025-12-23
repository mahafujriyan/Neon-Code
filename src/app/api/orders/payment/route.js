import { connectDB } from "../../../../lib/mongodb";
import Order from "../../../../models/Order";
import { uploadToDrive } from "../../../../lib/googleDrive";
import { NextResponse } from "next/server";

export async function POST(req) {
  await connectDB();
  const formData = await req.formData();

  const orderId = formData.get("orderId");
  const paidUSD = Number(formData.get("paidUSD"));
  const file = formData.get("screenshot");

  let imageUrl = "";

  if (file) {
    const buffer = await file.arrayBuffer();
    imageUrl = await uploadToDrive(
      buffer,
      Date.now() + "_" + file.name,
      file.type
    );
  }

  await Order.findByIdAndUpdate(orderId, {
    $push: {
      payments: {
        paidUSD,
        screenshot: imageUrl,
        date: new Date(),
        addedBy: "admin",
      },
    },
  });

  return NextResponse.json({ success: true });
}
