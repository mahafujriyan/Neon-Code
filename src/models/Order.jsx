import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    paidUSD: Number,
    date: { type: Date, default: Date.now },
    screenshot: String, // Google Drive link
    addedBy: String,
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    phone: String,
    pageLink: String,
    orderType: String,

    orderDate: { type: Date, default: Date.now },
    managerName: {
      type: String,
      enum: ["Sagor", "Sahed", "M. Abdur Rahaman"],
    },

    workStatus: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    totalAmountUSD: Number,
    dollarRate: Number,

    payments: [PaymentSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
