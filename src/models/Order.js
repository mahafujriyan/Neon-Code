import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    orderId: String,
    clientName: String,
    companyName: String,
    orderType: String,
    managerName: String,
    totalAmountUSD: Number,
    paidAmountUSD: Number,
    dueAmountUSD: Number,
    status: String,
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
