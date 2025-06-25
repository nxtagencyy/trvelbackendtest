import express from "express";
import Admin from "../models/adminModel.js";

const router = express.Router();

// 📌 Login Admin
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || admin.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    res.status(200).json({ success: true, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
