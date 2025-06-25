import express from "express";
import TourPackage from "../models/tourPackageModel.js";

const router = express.Router();

// 📌 POST - Create new tour package
router.post("/", async (req, res) => {
  try {
    const tour = new TourPackage(req.body);
    await tour.save();
    res.status(201).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📌 GET - Retrieve all tour packages
router.get("/", async (req, res) => {
  try {
    const tours = await TourPackage.find();
    res.status(200).json({ success: true, data: tours });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 📌 GET by slug
router.get("/:slug", async (req, res) => {
  try {
    const tour = await TourPackage.findOne({ slug: req.params.slug });
    if (!tour) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    res.status(200).json({ success: true, data: tour });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
