import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    // general | employee
    expenseType: {
      type: String,
      enum: ["general", "employee"],
      required: true,
    },

    // -------- GENERAL EXPENSE --------
    category: {
      type: String,
      enum: [
        "Office Supplies",
        "Transport",
        "Internet Bill",
        "Wifi Bill",
        "Snacks",
        "Utility Bill",
        "Other",
      ],
    },

    // -------- EMPLOYEE EXPENSE --------
    employeeName: String,
    employeeEmail: String,

    // -------- COMMON --------
    reason: {
      type: String,
      required: true,
    },

    amount: {
      type: Number,
      required: true, 
    },

    expenseDate: {
      type: Date,
      default: Date.now,
    },

    // who submitted (manager)
    managerName: String,
    managerEmail: String,

    createdByEmail: String,

    // -------- APPROVAL SYSTEM --------
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },

    approvedBy: {
      type: String, 
      default: null,
    },

    approvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Expense ||
  mongoose.model("Expense", ExpenseSchema);
