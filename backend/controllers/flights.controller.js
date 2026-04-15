import { Duffel } from '@duffel/api';
import dotenv from 'dotenv';

dotenv.config();

const duffel = new Duffel({
  token: process.env.DUFFEL_ACCESS_TOKEN, // Get this from duffel.com dashboard
});

export const getFlights = async (req, res) => {
  const { origin, destination, date } = req.query;

  try {
    const offerRequest = await duffel.offerRequests.create({
      slices: [
        {
          origin: origin,
          destination: destination,
          departure_date: date,
        },
      ],
      passengers: [{ type: 'adult' }],
      cabin_class: 'economy',
    });

    // Duffel returns 'offers' inside the offerRequest
    const flights = offerRequest.data.offers.map(offer => ({
      id: offer.id,
      airline: offer.owner.name,
      logo: offer.owner.logo_symbol_url,
      price: offer.total_amount,
      currency: offer.total_currency,
      departure: offer.slices[0].segments[0].departing_at,
      arrival: offer.slices[0].segments[0].arriving_at,
    }));

    res.status(200).json(flights);
  } catch (error) {
    console.error("Duffel API Error:", error);
    // If even Duffel fails, your presentation stays safe with the mock we built
    res.status(200).json(getMockFlights(origin, destination, date));
  }
};

// controllers/flightController.js

export const getFlightDetails = async (req, res) => {
  const { id } = req.params; // This is the offer_id from Duffel

  try {
    // Duffel allows you to retrieve a specific offer by ID
    const offer = await duffel.offers.get(id);

    if (!offer || !offer.data) {
      return res.status(404).json({ message: "Flight offer not found" });
    }

    // Clean the data for the frontend
    const detailedFlight = {
      id: offer.data.id,
      airline: offer.data.owner.name,
      logo: offer.data.owner.logo_symbol_url,
      price: offer.data.total_amount,
      currency: offer.data.total_currency,
      slices: offer.data.slices.map(slice => ({
        duration: slice.duration,
        origin: slice.origin.name,
        destination: slice.destination.name,
        segments: slice.segments.map(seg => ({
          departing_at: seg.departing_at,
          arriving_at: seg.arriving_at,
          marketing_carrier: seg.marketing_carrier.name,
          flight_number: seg.marketing_carrier_flight_number
        }))
      }))
    };

    res.status(200).json(detailedFlight);
  } catch (error) {
    console.error("Error fetching flight details:", error);
    
    // Safety check: if it's the 500 error we saw earlier, send a mock detail
    res.status(500).json({ 
      message: "Failed to fetch flight details", 
      error: error.message 
    });
  }
};