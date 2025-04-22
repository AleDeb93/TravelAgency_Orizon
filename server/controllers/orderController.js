const Orders = require('../models/Orders');
const Items = require('../models/Items');
const Destinations = require('../models/Destinations');

const orderController = {
    // POST /api/v2/orders/items
    createOrder: async (req, res) => {
        try {
            const { userId, items } = req.body;

            if (!userId) {
                return res.status(400).json({ error: `ID utente non fornito` });
            }
            if (!Array.isArray(items) || items.length === 0) {
                return res.status(400).json({ error: `Nessun articolo fornito per l'ordine` });
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

            // Creo nuovo ordine già completato
            const order = await Orders.create({
                user: userId,
                status: 'pending', // in attesa di pagamento
                buyedTickets: totalTickets,
                totalAmount: totalAmount,
            });

            // Aggiungo tutti gli items all’ordine
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
            console.error(error);
            res.status(500).json({ error: `Errore durante il recupero dell'ordine` });
        }
    },

    // GET /api/v2/orders
    getOrders: async (req, res) => {
        try {
            const { userId, status } = req.query;
            const where = {};
            if (userId) where.user = userId;
            if (status) where.status = status;
            const orders = await Orders.findAll({
                where,
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
                        const item = destination.Items?.[0]; // Ottengo il primo elemento associato alla destinazione
                        return {
                            ...destination,
                            buyedTickets: item.buyedTickets // Numero di biglietti acquistati
                        };
                    })
                };
            });
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Errore durante la chiamata getOrders' });
        }
    },

    // PUT /api/v2/orders/:orderId
    updateOrder: async (req, res) => {
        try {
            const { orderId } = req.params;
            const { destinationId, buyedTickets } = req.body;
            // Trovo l'ordine
            const order = await Orders.findByPk(orderId);
            if (!order) return res.status(404).json({ error: 'Ordine non trovato' });
            // Trovo la destinazione
            const destination = await Destinations.findByPk(destinationId);
            if (!destination) return res.status(404).json({ error: 'Destinazione non trovata' });
            // Trovo l'item associato all'ordine e alla destinazione
            let item = await Items.findOne({
                where: {
                    order: orderId,
                    destination: destinationId
                }
            });
            if (item) {
                // Caso 1: Aggiornamento quantità
                const ticketDiff = buyedTickets - item.buyedTickets;
                // Se la nuova quantità è 0, rimuovo l'item
                if (buyedTickets === 0) {
                    await item.destroy();
                    // Aggiorno i totali dell'ordine
                    order.buyedTickets -= item.buyedTickets;
                    order.totalAmount -= destination.price * item.buyedTickets;
                    await order.save();

                    return res.status(200).json({
                        message: 'Item rimosso con successo',
                        order
                    });
                }
                // Altrimenti aggiorno la quantità
                item.buyedTickets = buyedTickets;
                await item.save();
                // Aggiorno i totali dell'ordine
                order.buyedTickets += ticketDiff;
                order.totalAmount += destination.price * ticketDiff;
                await order.save();

                return res.status(200).json({
                    message: 'Item aggiornato con successo',
                    order,
                    item
                });
            } else {
                // Caso 2: Aggiunta nuovo item
                if (buyedTickets > 0) {
                    // Aggiungo l'item
                    item = await Items.create({
                        order: orderId,
                        destination: destinationId,
                        buyedTickets
                    });

                    // Aggiorno l’ordine
                    order.buyedTickets += buyedTickets;
                    order.totalAmount += destination.price * buyedTickets;
                    await order.save();

                    return res.status(201).json({
                        message: 'Item aggiunto con successo',
                        order,
                        item
                    });
                } else {
                    return res.status(400).json({ error: 'La quantità di biglietti deve essere maggiore di 0' });
                }
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Errore durante l'aggiunta o aggiornamento dell'item nell'ordine` });
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
            console.error(error);
            res.status(500).json({ error: `Errore durante la chiamta completeOrder` });
        }
    },
};


module.exports = orderController;

