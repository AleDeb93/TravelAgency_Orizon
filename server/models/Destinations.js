const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Destinations = sequelize.define('Destinations', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(128),
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    discount: {
        type: DataTypes.DECIMAL(5, 2),
        // Il discount può essere nullable
        allowNull: true  
    },
    location: {
        type: DataTypes.ENUM('Asia', 'Europa', 'Africa', 'Nord America', 'Sud America'), 
        allowNull: false
    },
    activity: {
        type: DataTypes.ENUM('Fotografia', 'Trekking', 'Relax', 'Salute e Benessere'), 
        allowNull: false
    },
    theme: {
        type: DataTypes.ENUM('Esperienziale', 'Naturalistico', 'Emozionale', 'Culturale', 'Enogastronomico', 'Famiglia'), 
        allowNull: false
    },
    sustainabilityRating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tickets: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,  
        allowNull: true
    }
}, {
    timestamps: false  
});


module.exports = Destinations;

