const Orders = require('../models/Orders');
const Items = require('../models/Items');
const Destinations = require('../models/Destinations');

const orderController = {
    // POST /api/v2/orders/items
    // POST /api/v2/orders/items
    createOrder: async (req, res) => {
        try {
            const { userId, items } = req.body;

            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ error: 'Nessun articolo fornito per l\'ordine' });
            }

            // Calcola totali
            let totalAmount = 0;
            let totalTickets = 0;

            // Calcolo totale e verifico le destinazioni
            for (const item of items) {
                const destination = await Destinations.findByPk(item.destinationId);
                if (!destination) {
                    return res.status(404).json({ error: `Destinazione con ID ${item.destinationId} non trovata` });
                }
                totalAmount += destination.price * item.buyedTickets;
                totalTickets += item.buyedTickets;
            }

            // Crea nuovo ordine già completato
            const order = await Orders.create({
                user: userId,
                status: 'completed',
                buyedTickets: totalTickets,
                totalAmount: totalAmount,
            });

            // Aggiungi tutti gli items all’ordine
            const createdItems = [];
            for (const item of items) {
                const created = await Items.create({
                    order: order.id,
                    destination: item.destinationId,
                    buyedTickets: item.buyedTickets,
                });
                createdItems.push(created);
            }

            res.status(201).json({
                message: 'Ordine completato con successo',
                order,
                items: createdItems,
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Errore durante la creazione dell'ordine` });
        }
    },

    // GET /api/v2/orders/:orderId
    getOrderByID: async (req, res) => {
        try {
            const { orderId } = req.params;
            // Recupero l'ordine specifico, inclusi gli articoli (destinazioni)
            const order = await Orders.findOne({
                where: { id: orderId },
                include: [
                    {
                        model: Destinations,
                        as: 'destinations',
                        through: {
                            attributes: ['order', 'destination', 'buyedTickets']
                        }
                    }
                ]
            });
            // Se l'ordine non esiste
            if (!order) {
                return res.status(404).json({ error: 'Ordine non trovato' });
            }
            // Restituisco i dettagli dell'ordine
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: `Errore durante il recupero dell'ordine` });
        }
    },
    // PUT /api/v2/orders/:orderId
    completeOrder: async (req, res) => {
        try {
            const { orderId } = req.params;
            // Recupero l'ordine specifico
            const order = await Orders.findOne({ where: { id: orderId } });
            // Se l'ordine non esiste
            if (!order) {
                return res.status(404).json({ error: 'Ordine non trovato' });
            }
            // Cambio lo stato dell'ordine a 'completed'
            order.status = 'completed';
            await order.save();
            res.status(200).json(order);
        } catch (error) {
            res.status(500).json({ error: 'Errore durante il completamento dell\'ordine' });
        }
    },
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

