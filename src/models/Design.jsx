import mongoose from "mongoose";

const DesignSchema = new mongoose.Schema({
  clientId: { type: String, required: true },
  managerName: String,
  managerEmail: String,
  description: String,
 driveLink: String,   // এখানে অনেকগুলো ইমেজ লিঙ্ক থাকবে (Comma separated)
folderLink: String,    // এখানে শুধুমাত্র ফোল্ডার লিঙ্ক থাকবে
  totalTasks: { type: Number, default: 0 },
  completeTasks: { type: Number, default: 0 },
  pendingTasks: { type: Number, default: 0 },
  successCount: { type: Number, default: 0 },
  rejectCount: { type: Number, default: 0 },
  submittedDate: String,
  status: { type: String, default: "pending" },
}, { timestamps: true });

export default mongoose.models.Design || mongoose.model("Design", DesignSchema);