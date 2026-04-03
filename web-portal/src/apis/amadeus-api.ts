import axios from 'axios';

const API_BASE = import.meta.env.VITE_Backend_url;

export interface FlightOffer {
  id: string;
  price: {
    total: string;
    currency: string;
  };
  itineraries: Array<{
    duration: any;
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
    // Points to http://localhost:3000/api/flights
    const response = await axios.get(`${API_BASE}/flights`, {
      params: { origin, destination, date }
    });
    // Amadeus always wraps the array in a 'data' property
    return response.data || [];
  } catch (error) {
    console.error("Error fetching flights:", error);
    return []; 
  }
};
