import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    paidUSD: Number,
    paidBDT: Number,
    paymentDate: Date,
    paymentMethod: String,

    proofImage: String, // screenshot url later
  },
  { timestamps: true }
);

export default mongoose.models.Payment ||
  mongoose.model("Payment", PaymentSchema);
