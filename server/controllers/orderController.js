const Orders = require('../models/Orders');
const Items = require('../models/Items');
const Destinations = require('../models/Destinations');

const orderController = {
    //     // GET /api/v2/orders
    //     getAllOrders: async (req, res) => {
    //         try {
    //             const orders = await Orders.findAll();
    //             res.status(200).json(orders);
    //         } catch (error) {
    //             res.status(500).json({ error: 'Errore durante la chiamata getAllOrders' })
    //         }
    //     }

    // GET /api/v2/orders
    getAllOrders: async (req, res) => {
        try {
            const orders = await Orders.findAll({
                include: [
                    {
                        model: Destinations, // Includo destinazioni tramite la relazione many-to-many
                        as: 'destinations',
                        through: {
                            attributes: ['order', 'destination', 'buyedTickets'] // Includo solo i dati di Items
                        }
                    }
                ]
            });

            // Modifico i dati degli ordini per includere il numero di biglietti per destinazione
            const result = orders.map(order => {
                return {
                    ...order.toJSON(),
                    destinations: order.destinations.map(destination => {
                        const item = destination.Items[0];
                        return {
                            ...destination,
                            buyedTickets: item.buyedTickets // Numero di biglietti acquistati
                        };
                    })
                };
            });

            res.status(200).json(result);
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata getAllOrders' });
        }
    }
};
module.exports = orderController;

