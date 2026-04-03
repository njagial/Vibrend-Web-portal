import axios from 'axios';
import dotenv from 'dotenv';


dotenv.config();

// Interface defining what a Destination looks like
export interface Destination {
  id: string;
  title: string;
  location: string;
  description: string;
  price: string;
  image_url: string;
}


const API_BASE = process.env.Backend_url || "http://localhost:3000/api";

const API = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Fetches all destinations for the grid view
 */
export const fetchDestinations = async (): Promise<Destination[]> => {
  try {
    const response = await API.get<Destination[]>('/destinations');
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to fetch destinations:', error.message);
    throw error;
  }
};

/**
 * Fetches a single destination for the details page
 */
export const fetchDestinationById = async (id: string): Promise<Destination> => {
  try {
    const response = await API.get<Destination>(`/destinations/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`❌ Failed to fetch destination ${id}:`, error.message);
    throw error;
  }
};