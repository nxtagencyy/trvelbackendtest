import mongoose from "mongoose";

const tripEnquirySchema = new mongoose.Schema(
  {
    journey_title: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    updates_optin: { type: String, default: "No" },
  },
  { timestamps: true }
);

export default mongoose.model("TripEnquiry", tripEnquirySchema);
