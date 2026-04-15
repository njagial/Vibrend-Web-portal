import axios from 'axios';

const API_BASE = import.meta.env.VITE_Backend_url;

export interface FlightSearchSchema {
  origin: string;
  destination: string;
  date: string;
}

export const searchFlights = async (params: FlightSearchSchema) => {
  try {
    // We send a request to our OWN backend, which now uses Duffel
    const response = await axios.get(`${API_BASE}/flights`, {
      params: {
        origin: params.origin,
        destination: params.destination,
        date: params.date
      }
    });

    // Our backend controller already cleans the data, so we just return it
    return response.data;

  } catch (error: any) {
    console.error("Flight Search Error:", error.message);
    
    // Safety Net: If the backend fails, the UI won't crash.
    // It will return an empty array or you can handle the error in the component.
    return []; 
  }
};