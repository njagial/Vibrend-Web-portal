import express from "express";
import mongoose from "mongoose";
import Destinations from "./models/destinations.model.js";
import destinationsRoute from "./routes/destinations.route.js";
import paymentRoutes from "./routes/payment.route.js";
import dotenv from "dotenv";

dotenv.config();




const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//routes
app.use("/api/destinations", destinationsRoute) 

app.use("/api/payments", paymentRoutes);


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
