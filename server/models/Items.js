const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Orders = require('./Orders');
const Destinations = require('./Destinations');

const Items = sequelize.define('Items', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order: {
        type: DataTypes.INTEGER,
        references: {
            model: Orders,
            key: 'id'
        }
    },
    destination: {
        type: DataTypes.INTEGER,
        references: {
            model: Destinations,
            key: 'id'
        }
    }
}, {
    tableName: 'items',
    timestamps: false
});

module.exports = Items;