import Destinations from '../models/destinations.model.js';

export const getDestinations = async (req, res) => {
    try {
        const destinations = await Destinations.find({});
        res.status(200).json(destinations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const getDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await Destinations.findById(id);
        res.status(200).json(destination);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const postDestination = async (req, res) => {
    try {
        const destination = await Destinations.create(req.body);
        res.status(201).json(destination);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await Destinations.findByIdAndUpdate(id, req.body);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
        }
        const updatedDestination = await Destinations.findById(id);
        res.status(200).json(updatedDestination);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteDestination = async (req, res) => {
    try {
        const { id } = req.params;
        const destination = await Destinations.findByIdAndDelete(id);
        if (!destination) {
            return res.status(404).json({ message: "Destination not found" });
    }
        res.status(200).json({ message: "Destination deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


//module.exports = {
    //getDestinations,
    //getDestination,
    //postDestination,
    //updateDestination,
    //deleteDestination,
    // Exporting the functions to be used in routes
//};
