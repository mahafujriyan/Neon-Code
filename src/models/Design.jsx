import mongoose from "mongoose";

const DesignSchema = new mongoose.Schema(
  {
    managerName: { type: String, required: true },
    managerEmail: { type: String, required: true },
    clientName: { type: String, required: true },
    description: { type: String }, 
    designImage: { type: String, required: true },
    workStatus: {
      type: String,
      enum: ["Pending", "Running", "Complete"],
      default: "Pending",
    },
    // এই ৫টি স্ট্যাটাস ফিল্ড
    totalTasks: { type: Number, default: 0 },
    completeTasks: { type: Number, default: 0 },
    pendingTasks: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    rejectCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
    approvedBy: { type: String, default: null },
    submittedDate: { type: String }, 
    submittedTime: { type: String }, 
  },
  { timestamps: true } 
);

export default mongoose.models.Design || mongoose.model("Design", DesignSchema);