const Orders = require('../models/Orders');
const Items = require('../models/Items');
const Destinations = require('../models/Destinations');

const orderController = {
    // POST /api/v2/orders/items
    createOrder: async (req, res) => {
        try {
            const { userId, destinationId, buyedTickets, } = req.body;
            // Verifco se l'utente ha già un ordine 'pending'
            const order = await Orders.findOne({
                where: { user: userId, status: 'pending' }
            });
            // Se esiste un ordine 'pending', aggiungo l'articolo a quell'ordine
            if (order) {
                // Verifico se l'articolo è già presente nel carrello
                const item = await Items.findOne({
                    where: { order: order.id, destination: destinationId }
                });
                if (item) {
                    return res.status(400).json({ error: 'Articolo già presente nel carrello' });
                }
            } else {
                // Se non esiste un ordine 'pending', creo un nuovo ordine
                order = await Orders.create({
                    user: userId,
                    status: 'pending',
                    buyedTickets: 0,
                    totalAmount: 0,
                });
            }
            // Verifico se la destinazione esiste
            const destination = await Destinations.findOne({ where: { id: destinationId } });
            if (!destination) {
                return res.status(404).json({ error: 'Destinazione non trovata' });
            }
            // Aggiungo la destinazione al carrello (creazione di un item)
            const item = await Items.create({
                order: order.id,
                destination: destinationId,
                buyedTickets: buyedTickets
            });
            // Calcolo il totale dell'ordine aggiornato
            const destinationPrice = destination.price;
            const totalAmount = destinationPrice * buyedTickets;
            order.totalAmount += totalAmount;
            order.buyedTickets += buyedTickets;
            // Salvo l'ordine con il nuovo totale e metto l'articolo nel carrello
            await order.save();
            res.status(201).json(item);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Errore durante l'aggiunta dell'articolo al carrello` });
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

