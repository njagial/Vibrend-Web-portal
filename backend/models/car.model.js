import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  model: { type: String, required: true },
  provider: { type: String, required: true },
  pricePerDay: { type: Number, required: true }, // Store as a number for calculations
  image: { type: String, required: true }, // URL to an image
  available: { type: Boolean, default: true },
  city: { type: String, required: true }
});


export const Car = mongoose.model("Car", carSchema);