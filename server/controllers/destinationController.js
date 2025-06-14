const { Op } = require('sequelize');
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
    },
    // GET api/vs/destinations/filters
    getDestinationsByPreferences: async (req, res) => {
        const { activity, theme, location, discounted } = req.query;
        console.log(`[${new Date().toLocaleString()}] Query Sequelize:`, { activity, theme, location, discounted });
        try {
            const whereClause = {};
            // Applico filtri se presenti nella query
            if (activity) whereClause.activity = activity;
            if (theme) whereClause.theme = theme;
            if (location) whereClause.location = location;
            if (discounted === 'true') {
                whereClause.discount = {
                    [Op.gt]: 0
                };
            }
            // Destinations in base ai filtri
            console.log(`[${new Date().toLocaleString()}] Query Sequelize WHERE CLAUSE:`, whereClause);
            const destinations = await Destinations.findAll({ where: whereClause });
            // Risposta
            if (destinations.length > 0)
                res.status(200).json(destinations);
            else
                res.status(404).json({ error: 'Destinazioni non trovate' });
        } catch (error) {
            console.error("Errore durante la query:", error);
            res.status(500).json({ error: 'Errore durante la chiamata getDestinationsByPreferences' })
        }
    }
};

module.exports = destinationController;