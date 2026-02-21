import mongoose from "mongoose";

const destinationSchema = mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image_url: { type: String, required: true },
  category: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  region: { type: String, required: true },
  rating: { type: Number, required: true },
});

const Destinations = mongoose.model("Destination", destinationSchema);
export default Destinations;