import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://cdevnxtagency:WyMj5N6ozVshVhfk@cluster0.uenjbun.mongodb.net/travelweb?retryWrites=true&w=majority&appName=Cluster0`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1); // Ensures app doesn't run with DB failure
  }
};
