import mongoose from "mongoose";

const tourDetailSchema = new mongoose.Schema({
  tour_title: String,
  tour_details: String,
});

const includedSchema = new mongoose.Schema({
  text: String,
});

const excludedSchema = new mongoose.Schema({
  text: String,
});

const tourPackageSchema = new mongoose.Schema(
  {
    title: String,
    about: String,
    days: Number,
    nights: Number,
    activities: String,
    activities_slug: String,
    destinations: String,
    destinations_slug: String,
    offers: Boolean,
    thumbnail_url: String,
    image_url: String,
    slug: String,
    tour_details: [tourDetailSchema],
    included: [includedSchema],
    excluded: [excludedSchema],
  },
  { timestamps: true }
);

export default mongoose.model("TourPackage", tourPackageSchema);
