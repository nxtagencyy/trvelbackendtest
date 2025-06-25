import express from "express";
import { connectDB } from "./db/db.js";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.router.js";
import tourRouter from "./routes/tourPackage.router.js";
import enquiryRouter from "./routes/enquiry.router.js";
import adminRouter from "./routes/admin.router.js"; // ✅ Add this

import cors from "cors";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000", // Local frontend
      "https://smarttraveingsmart.vercel.app", // ✅ Production frontend
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

connectDB();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/tours", tourRouter);
app.use("/api/enquiry", enquiryRouter);
app.use("/api/admin", adminRouter); // ✅ Mount admin routes

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(8080, () => {
  console.log("server running 8080");
});
