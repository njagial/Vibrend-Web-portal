import { Router } from 'express';
import { getFlights } from '../controllers/amadeus.controller.js';



const router = Router();

// Define clean, separate endpoints under the same router
router.get('/flights', getFlights);

export default router;