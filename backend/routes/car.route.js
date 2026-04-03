// routes/car.route.js
import express from "express";
import { getAllCars, addCar, getCarById } from "../controllers/car.controller.js";

const router = express.Router();

router.get("/", getAllCars);
router.post("/add", addCar); // For you to add cars via Postman
router.get("/:id", getCarById); // Get details of a single car

export default router;