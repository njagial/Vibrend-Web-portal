
import Booking from '../models/booking.model.js';

// Create a new booking
export async function createBooking(req, res) {
    try {
        const { destinationId, destinationTitle, amount, people, duration, phoneNumber, status } = req.body;
        
        const newBooking = new Booking({
            destinationId,
            destinationTitle,
            amount,
            people,
            duration,
            phoneNumber,
            status: status || 'confirmed'
        });

        const savedBooking = await newBooking.save();
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(400).json({ message: "Error saving booking", error: error.message });
    }
}

// Get all bookings (History)
export async function getMyBookings(req, res) {
    try {
        // Sort by newest first
        const bookings = await find().sort({ createdAt: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching history", error: error.message });
    }
}

// Delete a specific booking
export async function deleteBooking(req, res) {
    try {
        const { id } = req.params;
        const deleted = await Booking.findByIdAndDelete(id);
        
        if (!deleted) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting booking", error: error.message });
    }
};