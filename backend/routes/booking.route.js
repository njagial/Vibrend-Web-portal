import { Router } from 'express';
import { createBooking, getMyBookings, deleteBooking } from '../controllers/booking.controller.js';

const router = Router();

// POST: /api/bookings
router.post('/', createBooking);

// GET: /api/bookings/my-history
router.get('/my-history', getMyBookings);

// DELETE: /api/bookings/:id
router.delete('/:id', deleteBooking);

export default router;