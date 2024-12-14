const Destinations = require('../models/Destinations');

const destinationController = {
    // GET /api/v2/destinations
    getAllDestinations: async (req, res) => {
        try {
            const destinations = await Destinations.findAll();
            res.status(200).json(destinations);
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata getAllDestinations' })
        }
    }
};

module.exports = destinationController;