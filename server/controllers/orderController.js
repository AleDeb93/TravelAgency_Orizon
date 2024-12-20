const Orders = require('../models/Orders');

const orderController = {
    // GET /api/v2/orders
    getAllOrders: async (req, res) => {
        try {
            const orders = await Orders.findAll();
            res.status(200).json(orders);
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata getAllOrders' })
        }
    }
};

module.exports = orderController;