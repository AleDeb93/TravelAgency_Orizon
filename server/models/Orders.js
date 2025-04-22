const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Users = require('./Users');
const Destinations = require('./Destinations');
const Items = require('./Items'); // Importato per la relazione

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
    totalAmount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    user: {
        type: DataTypes.INTEGER,
        references: {
            model: Users,
            key: 'id'
        },
        allowNull: false
    }
}, {
    timestamps: false
});

// Relazioni
Orders.belongsTo(Users, { foreignKey: 'user' });
Orders.belongsToMany(Destinations, { through: Items, foreignKey: 'order', as: 'destinations' });

module.exports = Orders;
