import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTIONSTRING);
    console.log("✅ Connected MongoDB");
  } catch (error) {
    console.error("❌ DB Error:", error);
    process.exit(1);
  }
};

export default connectDB;
