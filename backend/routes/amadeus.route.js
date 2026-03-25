import express from 'express';
import { searchFlights, searchCars } from '../controllers/amadeus.controller.js';

const router = express.Router();

router.get('/flights', searchFlights);
router.get('/cars', searchCars);

export default router;