const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    email: {
        type: DataTypes.STRING(128),
        unique: true,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Nonbinary'), 
        allowNull: false,
    },
    password_hash: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    isLogged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    preferences: {
        // Usato JSONB in modo da poter eseguire query più velocemente
        type: DataTypes.JSON,  
        allowNull: true
    },
    paymentMethod: {
        type: DataTypes.ENUM('credit_card', 'paypal', 'bank_transfer'), 
        allowNull: true
    }
}, {
    // Evito la creazione automatica di createdAt / updatedAt
    timestamps: false
});

module.exports = Users;