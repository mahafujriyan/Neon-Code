// models/Design.js
import mongoose from "mongoose";

const DesignSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  managerName: String,
  managerEmail: String,
  description: String,
  driveLink: String,
  totalTasks: Number,
  completeTasks: Number,
  pendingTasks: Number,
  successCount: Number,
  rejectCount: Number,
  status: { type: String, default: "pending" },
}, { timestamps: true });

export default mongoose.models.Design || mongoose.model("Design", DesignSchema);