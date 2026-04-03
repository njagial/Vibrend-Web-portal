import { Car } from "../models/car.model.js";

// --- GET ALL CARS ---
// Used by the frontend to populate the "Car Leasing" grid
export const getAllCars = async (req, res) => {
  try {
    const cars = await Car.find({});
    res.status(200).json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Failed to fetch car fleet from database" });
  }
};

// --- GET SINGLE CAR DETAILS ---
// Useful if you want a "View Details" page before paying
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ error: "Car not found" });
    res.status(200).json(car);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving car details" });
  }
};

// --- ADD NEW CAR (Admin Use) ---
// Use this to populate your DB with local cars (Prados, X-Trails, etc.)
export const addCar = async (req, res) => {
  try {
    const newCar = new Car(req.body);
    const savedCar = await newCar.save();
    res.status(201).json(savedCar);
  } catch (error) {
    res.status(400).json({ error: "Failed to add car to database" });
  }
};