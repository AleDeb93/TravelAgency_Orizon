// Questo file mi permette di inizializzare i modelli e le relazioni tra di essi.
// Inizializzo sequelize e i modelli
const sequelize = require('../config/database');
const Users = require('./Users');
const Orders = require('./Orders');
const Destinations = require('./Destinations');
const Items = require('./Items');

// Definisco le relazioni tra i modelli
// Users e Orders: un utente può avere più ordini
Orders.belongsTo(Users, { foreignKey: 'user' });
// Orders e Destinations: un ordine può avere più destinazioni e una destinazione può essere in più ordini
// Quindi creo una relazione many-to-many tra Orders e Destinations tramite il modello Items
Orders.belongsToMany(Destinations, {
    through: Items,
    foreignKey: 'order',
    otherKey: 'destination',
    as: 'destinations'
});
Destinations.belongsToMany(Orders, {
    through: Items,
    foreignKey: 'destination',
    otherKey: 'order',
    as: 'orders'
});

// Esporto i modelli e sequelize
module.exports = {
    sequelize,
    Users,
    Orders,
    Destinations,
    Items
};
