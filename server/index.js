const express = require('express');
const sequelize = require('./config/database');
const app = express()
const port = 3000

// Middleware per parsare i JSON
app.use(express.json());

// Test connessione al database
sequelize.authenticate()
    .then(() => {
        console.log(`Connessione al database riuscita!`);
    })
    .catch(error => {
        console.log(`Impossibile connettersi al database:`, error)
    });

// Sincronizzazione del database
sequelize.sync({ force: false })
    .then(() => {
        console.log(`Tabelle sincronizzate correttamente!`);
    })
    .catch(err => {
        console.error(`Errore durante la sincronizzazione:`, err);
    });


// Avvio del server
app.listen(port, () => {
    console.log(`Servr in ascolto alla porta ${port}`);
});

