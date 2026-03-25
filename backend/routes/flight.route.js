import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

let accessToken = "";

const getAmadeusToken = async () => {
    // Note the use of axios.post instead of just post
    const response = await axios.post(
        'https://test.api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: process.env.AMADEUS_KEY,
            client_secret: process.env.AMADEUS_SECRET
        }).toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    accessToken = response.data.access_token;
};

router.get('/search', async (req, res) => {
    try {
        if (!accessToken) await getAmadeusToken();

        const { origin, destination, date } = req.query;
        // Note the use of axios.get instead of just get
        const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
            params: {
                originLocationCode: origin,
                destinationLocationCode: destination,
                departureDate: date,
                adults: 1
            },
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Flight API Error", details: error.message });
    }
});

export default router; // Use export default for ESM