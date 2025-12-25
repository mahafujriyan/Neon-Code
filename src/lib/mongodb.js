import mongoose from "mongoose";

// আপনার নতুন কাজ করা URI টি এখানে দিন
const MONGODB_URI = "mongodb+srv://NeonCode:5SIs1SyH9yNsqTpq@cluster0.icqw4le.mongodb.net/neon_database?retryWrites=true&w=majority";

export async function connectDB() {
  try {
    if (mongoose.connection.readyState >= 1) return;
    
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB Connected Successfully ✅");
  } catch (error) {
    console.error("MongoDB Connection Error ❌:", error.message);
    // Authentication error ফিক্স করার জন্য লগ
    if (error.message.includes("auth failed")) {
      console.log("Tip: Please check if your IP is whitelisted in MongoDB Atlas.");
    }
  }
}