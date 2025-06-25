import express from "express";
import TripEnquiry from "../models/tripEnquiry.model.js";

const router = express.Router();

// @route   POST /api/enquiry
// @desc    Submit a new trip enquiry
router.post("/", async (req, res) => {
  try {
    const {
      journey_title,
      first_name,
      last_name,
      email,
      city,
      phone,
      updates_optin,
    } = req.body;

    const newEnquiry = new TripEnquiry({
      journey_title,
      first_name,
      last_name,
      email,
      city,
      phone,
      updates_optin,
    });

    await newEnquiry.save();
    res.status(201).json({ message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Error saving enquiry:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
