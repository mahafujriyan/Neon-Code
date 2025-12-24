import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  phone: String,
  pageLink: String,
  orderType: String,
  orderDate: { type: Date, default: Date.now },
  managerName: String,
  managerEmail: { type: String, required: true }, 
  note: { type: String, default: "" },             
  taskCount: { type: Number, default: 0 }, // টাস্কের হিসাব আলাদা থাকবে
  totalAmountUSD: { type: Number, default: 0 },
  dollarRate: { type: Number, default: 135 },
  buyRate: { type: Number, default: 130 },
  paymentMethod: { type: String, default: "Bkash" },
  workStatus: { type: String, default: "pending" },
  payments: [{
    paidUSD: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);