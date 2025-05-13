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
            console.log(items);  // Aggiungi questo per vedere cosa viene passato

            for (const item of items) {
                const destination = await Destinations.findByPk(item.destinationId);
                if (!destination) {
                    return res.status(404).json({ error: `Destinazione con ID ${item.destinationId} non trovata` });
                }

                // Aggiungi il controllo su buyedTickets
                if (!item.buyedTickets || isNaN(item.buyedTickets)) {
                    return res.status(400).json({ error: `Numero di biglietti non valido per la destinazione ${item.destinationId}` });
                }

                const price = parseFloat(destination.price);
                const discount = destination.discount ? parseFloat(destination.discount) : 0;
                const finalPrice = price - (price * discount / 100);
                totalAmount += finalPrice * item.buyedTickets;

            }
            // Creo nuovo ordine già completato
            const order = await Orders.create({
                user: userId,
                status: 'pending',
                totalAmount: totalAmount,
            });
            // Aggiungo gli items all'ordine
            // Aggiungo gli items all'ordine usando bulkCreate
            const createdItems = await Items.bulkCreate(
                items.map(item => ({
                    order: order.id,
                    destination: item.destinationId,
                    buyedTickets: item.buyedTickets,
                }))
            );

            res.status(201).json({
                message: 'Ordine completato con successo',
                order,
                items: createdItems,
            });

        } catch (error) {
            console.error('Errore: ', error);
            res.status(500).json({ error: `Errore durante la creazione dell'ordine`, details: error.message });
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
                    destinations: order.destinations.map(destination => ({
                        ...destination.toJSON(),
                        buyedTickets: destination.Items?.buyedTickets ?? 0
                    }))
                };
            });
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Errore durante la chiamata getOrders' });
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
            if (!order)
                return res.status(404).json({ error: 'Ordine non trovato' });
            const result = {
                ...order.toJSON(),
                destinations: order.destinations.map(destination => ({
                    ...destination.toJSON(),
                    buyedTickets: destination.Items?.buyedTickets ?? 0
                }))
            };
            // Restituisco i dettagli dell'ordine
            res.status(200).json(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: `Errore durante il recupero dell'ordine` });
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
                // Se la nuova quantità è 0, rimuovo l'item
                if (buyedTickets === 0) {
                    await item.destroy();
                    // Calcolo il prezzo scontato
                    const price = parseFloat(destination.price);
                    const discount = destination.discount ? parseFloat(destination.discount) : 0;
                    const finalPrice = price - (price * discount / 100);
                    // Rimuovo l'ammontare precedente dall'ordine
                    order.totalAmount = parseFloat(order.totalAmount); 
                    order.totalAmount -= finalPrice * item.buyedTickets;
                    // Log di debug
                    console.log(`[DEBUG] -${finalPrice * item.buyedTickets} rimosso per ${destination.name}`);
                    console.log(`[DEBUG] Totale aggiornato: ${order.totalAmount}`);
                    console.log('[DEBUG] Tipo di totalAmount:', typeof order.totalAmount, order.totalAmount);

                    // Salvo l'ordine
                    await order.save();
                    return res.status(200).json({
                        message: 'Item rimosso con successo',
                        order
                    });
                }

                // Altrimenti aggiorno la quantità
                // Log di debug
                console.log(`[DEBUG] Item vecchio: ${item.buyedTickets} biglietti per ${destination.name}`);
                console.log(`[DEBUG] Item aggiornato: ${buyedTickets} biglietti per ${destination.name}`);

                // Calcolo il prezzo scontato
                const price = parseFloat(destination.price);
                const discount = destination.discount ? parseFloat(destination.discount) : 0;
                const finalPrice = price - (price * discount / 100);

                // Calcolo la differenza di ammontare tra la nuova quantità e la vecchia
                const previousAmount = item.buyedTickets * finalPrice;
                const newAmount = buyedTickets * finalPrice;
                const diffAmount = newAmount - previousAmount;

                // Assicuriamoci che `order.totalAmount` sia trattato come un numero
                order.totalAmount = parseFloat(order.totalAmount);

                // Aggiungo/subtrae questa differenza al totale dell'ordine
                order.totalAmount += diffAmount;
                // Log di debug
                console.log(`[DEBUG] +${diffAmount} aggiunto per ${destination.name}`);
                console.log(`[DEBUG] Totale aggiornato: ${order.totalAmount}`);
                console.log('[DEBUG] Tipo di totalAmount:', typeof order.totalAmount, order.totalAmount);
                // Aggiorno i tickets
                item.buyedTickets = buyedTickets;   
                // Salvo l'item e l'ordine
                await item.save();             
                await order.save();

                // Log di debug
                console.log(`[DEBUG] Ora i buyedTickets sono: ${item.buyedTickets} biglietti per ${destination.name}`);
                
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

                    // Calcolo il prezzo scontato
                    const price = parseFloat(destination.price);
                    const discount = destination.discount ? parseFloat(destination.discount) : 0;
                    const finalPrice = price - (price * discount / 100);
                    // Aggiungo il totale dell'ordine con il nuovo item
                    order.totalAmount = parseFloat(order.totalAmount); // Converto a numero
                    order.totalAmount += finalPrice * item.buyedTickets;
                    // Arrotondo il totale
                    order.totalAmount = parseFloat(order.totalAmount.toFixed(2));

                    console.log(`[DEBUG] +${finalPrice * item.buyedTickets} aggiunto per ${destination.name}`);
                    console.log(`[DEBUG] Totale aggiornato: ${order.totalAmount}`);
                    console.log('[DEBUG] Tipo di totalAmount:', typeof order.totalAmount, order.totalAmount);

                    // Aggiorno il totale
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

    // DELETE /api/v2/orders/:id
    deleteOrder: async (req, res) => {
        const { orderId } = req.params;
        try {
            const order = await Orders.findByPk(orderId);
            if (!order)
                return res.status(404).json({ error: 'Ordine non trovato' });
            // Se l'ordine è già completato, non posso eliminarlo
            if (order.status === 'completed')
                return res.status(400).json({ error: 'Impossibile eliminare un ordine già completato' });
            // Elimino l'ordine
            await order.destroy();
            res.status(200).json({ message: 'Ordine eliminato' });
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata deleteOrder' });
        }
    }
};


module.exports = orderController;

