import express from 'express';
import { getFlights, getFlightDetails } from '../controllers/flights.controller.js';

const router = express.Router();

// @route   GET /api/flights/search
// @desc    Search for flights using Duffel API
router.get('/', getFlights);

// @route   GET /api/flights/:id
// @desc    Get specific flight details (useful for the booking summary page)
router.get('/:id', getFlightDetails);

export default router;