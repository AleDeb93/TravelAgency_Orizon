const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Users = require('./Users');
const Destinations = require('./Destinations');

const Orders = sequelize.define('Orders', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    orderDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    buyedTickets: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    timestamps: false
});

// Relazioni
Order.belongsTo(Users, { foreignKey: 'user' });  // Relazione con User
Order.belongsToMany(Destinations, { // Relazione con Destination 
    through: 'Items',
    foreignKey: 'order',
    as: 'destinations' 
});  

module.exports = Orders;
