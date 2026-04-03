import Amadeus from 'amadeus';
import dotenv from 'dotenv';

dotenv.config();


// Initialize Amadeus with your credentials
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_KEY,
  clientSecret: process.env.AMADEUS_SECRET
});

// --- FLIGHTS CONTROLLER ---
export const getFlights = async (req, res) => {
  const { origin, destination, date } = req.query;
  
  try {
    const response = await amadeus.shopping.flightOffersSearch.get({
        originLocationCode: origin,      // Note the specific key name
        destinationLocationCode: destination,
        departureDate: date,
        adults: '1'                      // Required parameter
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Flight API Error:", error.response?.data || error);
    res.status(500).json({ 
      error: "Flight search failed", 
      details: error.response?.data?.errors || error.description 
    });
  }
};