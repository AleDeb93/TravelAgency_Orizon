const express = require('express');
const sequelize = require('./config/database');
require('./models/initModel'); 
const usersRouting = require('./routes/usersRouting'); 
const destinationsRouting = require('./routes/destinationsRouting');
const ordersRouting = require('./routes/ordersRouting');
const cors = require('cors');
const app = express();
const path = require('path');


// Middleware per parsare i JSON
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    // credentials: true
}));


// Definizione delle rotte
app.use('/api/v2/users', usersRouting);
app.use('/api/v2/destinations', destinationsRouting);
app.use('/api/v2/orders', ordersRouting);
app.use('/destinationsIMG', express.static(path.join(__dirname, '../docs/destinationsIMG')));


// Test connessione al database
sequelize.authenticate()
    .then(() => {
        console.log(`[${new Date().toLocaleString()}] Connessione al database riuscita!`);
    })
    .catch(error => {
        console.log(`[${new Date().toLocaleString()}] Impossibile connettersi al database:`, error);
    });

// Sincronizzazione del database
sequelize.sync({ force: false, alter: false })
    .then(() => {
        console.log(`[${new Date().toLocaleString()}] Sincronizzazione effettuata!`);
    })
    .catch(err => {
        console.error(`[${new Date().toLocaleString()}] Errore durante la sincronizzazione:`, err);
    });

// Avvio del server
const port = 3000;

app.listen(port, () => {
    console.log(`[${new Date().toLocaleString()}] Server in ascolto alla porta ${port}`);
});
