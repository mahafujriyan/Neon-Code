import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    phone: String,
    pageLink: String,
    orderType: String,
    orderDate: { type: Date, default: Date.now },
    managerName: {
      type: String,
      // এখানে সব নামগুলো দিয়ে রাখলাম যা আপনি ব্যবহার করছেন
      enum: ["Sagor", "Sahed", "Shahed", "M. Abdur Rahaman", "Mahafuj"],
    },
    totalAmountUSD: { type: Number, default: 0 },
    dollarRate: { type: Number, default: 135 }, // Sell Rate
    buyRate: { type: Number, default: 130 },   // Buy Rate
    paymentMethod: {
      type: String,
      // enum টা তুলে দেয়া ভালো যদি আপডেট করতে সমস্যা হয়, 
      // অথবা ড্রপডাউনের সাথে হুবহু মিল রাখতে হবে।
      default: "Bkash"
    },
    workStatus: {
      type: String,
      enum: ["pending", "running", "completed"],
      default: "pending",
    },
    workProof: String, 
    payments: [{
      paidUSD: { type: Number, default: 0 },
      date: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);