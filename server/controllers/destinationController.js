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
    },
    // GET /api/v2/destinations/:id
    getDestinationByID: async (req, res) => {
        const { id } = req.params;
        try {
            const destination = await Destinations.findByPk(id);
            if (destination)
                res.status(200).json(destination);
            else
                res.status(404).json({ error: 'Destinazione non trovata' });
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata getDestinationByID' })
        }
    }
};

module.exports = destinationController;