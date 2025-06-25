import express from "express";
import TourPackage from "../models/tourPackageModel.js";

const router = express.Router();

// 📌 POST - Add a new tour
router.post("/", async (req, res) => {
  try {
    const tour = new TourPackage(req.body);
    await tour.save();
    res.status(201).json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📌 GET all tours
router.get("/", async (req, res) => {
  try {
    const tours = await TourPackage.find();
    res.status(200).json({ success: true, data: tours });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 📌 GET by slug
router.get("/:slug", async (req, res) => {
  try {
    const tour = await TourPackage.findOne({ slug: req.params.slug });
    if (!tour)
      return res
        .status(404)
        .json({ success: false, message: "Tour not found" });

    res.status(200).json({ success: true, data: tour });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
