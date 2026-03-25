import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

let cachedToken = null;
let tokenExpiry = null;

const getAmadeusToken = async () => {
    const now = Date.now();
    if (cachedToken && tokenExpiry && now < tokenExpiry) return cachedToken;

    try {
        const response = await axios.post(
            'https://test.api.amadeus.com/v1/security/oauth2/token',
            new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: process.env.AMADEUS_KEY,
                client_secret: process.env.AMADEUS_SECRET
            }).toString(),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        cachedToken = response.data.access_token;
        tokenExpiry = now + response.data.expires_in * 1000;
        return cachedToken;
    } catch (error) {
        console.error("TOKEN ERROR:", error.response?.data || error.message);
        return null; // Return null so we can trigger dummy data fallback
    }
};

export const searchFlights = async (req, res) => {
    try {
        const token = await getAmadeusToken();
        const { origin, destination, date } = req.query;

        // Fallback to Dummy Data if Token fails or API keys are missing
        if (!token || !process.env.AMADEUS_KEY) {
            return res.json({ 
                data: [
                    { id: '1', price: { total: '450.00' }, itineraries: [{ segments: [{ departure: { at: `${date}T10:00:00`, iataCode: origin }, arrival: { at: `${date}T14:00:00`, iataCode: destination } }] }], validatingAirlineCodes: ['KQ'] }],
                meta: { count: 1, note: "DUMMY_DATA_MODE" }
            });
        }

        const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
            params: {
                originLocationCode: origin,
                destinationLocationCode: destination,
                departureDate: date,
                adults: 1,
                currencyCode: 'USD'
            },
            headers: { Authorization: `Bearer ${token}` }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Flight API Error", details: error.message });
    }
};

export const searchCars = async (req, res) => {
    try {
        const token = await getAmadeusToken();
        const { cityCode, pickupDate, returnDate } = req.query;

        // Fallback for testing/missing keys
        if (!token) {
            return res.json({
                data: [
                    { id: 'C1', provider: 'Hertz', vehicle: { type: 'SUV', model: 'Toyota RAV4' }, price: { total: '85.00', currency: 'USD' } },
                    { id: 'C2', provider: 'Avis', vehicle: { type: 'Sedan', model: 'Honda Civic' }, price: { total: '45.00', currency: 'USD' } }
                ],
                meta: { note: "DUMMY_CAR_DATA" }
            });
        }

        const response = await axios.get('https://test.api.amadeus.com/v1/shopping/car-offers', {
            params: {
                cityCode: cityCode || 'NBO',
                pickupDate: pickupDate,
                returnDate: returnDate,
                adults: 1
            },
            headers: { Authorization: `Bearer ${token}` }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Car API Error", details: error.message });
    }
};