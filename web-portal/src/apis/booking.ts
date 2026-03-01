import axios from 'axios';

// Use the same base URL as your destinations API
const API_BASE = "http://localhost:3000/api/bookings";

export interface Booking {
  id?: string;
  destinationId: string;
  destinationTitle: string;
  amount: number;
  people: number;
  duration: number;
  phoneNumber: string;
  status: 'pending' | 'confirmed' | 'failed';
  createdAt?: string;
}

/**
 * Saves a successful booking to the database
 */
export const createBooking = async (bookingData: Booking): Promise<Booking> => {
  try {
    const response = await axios.post(`${API_BASE}`, bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

/**
 * Fetches the full history of bookings
 */
export const fetchMyBookings = async (): Promise<Booking[]> => {
  try {
    const response = await axios.get(`${API_BASE}/my-history`);
    return response.data;
  } catch (error) {
    console.error("Error fetching booking history:", error);
    return []; // Return empty array to prevent frontend crashes
  }
};

/**
 * Deletes a booking from the history
 */
export const deleteBooking = async (bookingId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE}/${bookingId}`);
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};