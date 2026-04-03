import express from "express";
import mongoose from "mongoose";
import destinationsRoute from "./routes/destinations.route.js";
import paymentRoutes from "./routes/payment.route.js";
import cors from "cors"
import bookingRoutes from './routes/booking.route.js';
import amadeusRoutes from './routes/amadeus.route.js';
import dotenv from 'dotenv';
import carRoutes from './routes/car.route.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors()); // This allows your React dashboard to talk to your API

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/destinations", destinationsRoute) 

app.use("/api/payments", paymentRoutes);

app.use('/api/bookings', bookingRoutes); // This adds the /api/bookings prefix

app.use('/api', amadeusRoutes); // This adds the /api/flights prefix for Amadeus routes

app.use('/api/cars', carRoutes); // This adds the /api/cars prefix for car routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});




mongoose
  .connect(
    process.env.MongoDB_URI
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log("Server is running on port " + PORT);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
