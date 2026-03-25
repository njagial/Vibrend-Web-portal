import axios from 'axios';

const API_BASE = "http://localhost:3000/api/flights";

export interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    segments: Array<{
      departure: { iataCode: string; at: string };
      arrival: { iataCode: string; at: string };
      carrierCode: string;
      duration: string;
    }>;
  }>;
  validatingAirlineCodes: string[];
}

/**
 * Fetch flights based on origin, destination, and date
 */
export const fetchFlights = async (origin: string, destination: string, date: string): Promise<FlightOffer[]> => {
  try {
    const response = await axios.get(`${API_BASE}/flights`, {
      params: { origin, destination, date }
    });
    // Amadeus always wraps the array in a 'data' property
    return response.data.data || [];
  } catch (error) {
    console.error("Error fetching flights:", error);
    return []; 
  }
};

/**
 * Fetch car leasing/rental offers for a specific city
 */
export const fetchCars = async (cityCode: string, pickup: string, dropoff: string) => {
  try {
    const response = await axios.get(`${API_BASE}/cars`, {
      params: { cityCode, pickupDate: pickup, returnDate: dropoff }
    });
    return response.data.data || [];
  } catch (error) {
    console.error("Car search error:", error);
    return [];
  }
};