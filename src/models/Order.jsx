import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    phone: String,
    pageLink: String,
    orderType: String,

    orderDate: { type: Date, default: Date.now },

    managerName: String,
    managerEmail: { type: String, required: true },

    note: { type: String, default: "" },

    // ---- AMOUNT LOGIC ----
    taskCount: { type: Number, default: 0 }, // non-USD service
    totalAmountUSD: { type: Number, default: 0 }, // Ads / USD service

    dollarRate: { type: Number, default: 135 },
    buyRate: { type: Number, default: 130 },

    paymentMethod: { type: String, default: "Bkash" },

    workStatus: {
      type: String,
      enum: ["pending", "running", "completed"],
      default: "pending",
    },

    payments: [
      {
        paidUSD: { type: Number, default: 0 },
        paidBDT: { type: Number, default: 0 },
        paymentMethod: { type: String, default: "Bkash" },
        paymentDate: { type: Date, default: Date.now },
        screenshot: { type: String }, // Google Drive / ImgBB URL
      },
    ],
  },
  { timestamps: true }
);

// ✅ DEFAULT EXPORT (VERY IMPORTANT)
export default mongoose.models.Order ||
  mongoose.model("Order", OrderSchema);
