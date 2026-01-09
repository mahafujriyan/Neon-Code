import mongoose from "mongoose";

const DesignSchema = new mongoose.Schema({
  clientId: { type: String, required: true }, // ইউনিক আইডি
  managerName: String,
  managerEmail: String,
  description: String,
  driveLink: String,
  totalTasks: { type: Number, default: 0 },
  completeTasks: { type: Number, default: 0 },
  pendingTasks: { type: Number, default: 0 },
  successCount: { type: Number, default: 0 },
  rejectCount: { type: Number, default: 0 },
  submittedDate: String, // '2026-01-09' ফরম্যাটে থাকবে
  status: { type: String, default: "pending" },
}, { timestamps: true });

export default mongoose.models.Design || mongoose.model("Design", DesignSchema);