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
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type,Authorization',
}));


// Definizione delle rotte
app.use('/api/v2/users', usersRouting);
app.use('/api/v2/destinations', destinationsRouting);
app.use('/api/v2/orders', ordersRouting);
app.use('/destinationsIMG', express.static(path.join(__dirname, '../docs/destinationsIMG')));


// Test connessione al database
sequelize.authenticate()
    .then(() => {
        console.log(`Connessione al database riuscita!`);
    })
    .catch(error => {
        console.log(`Impossibile connettersi al database:`, error);
    });

// Sincronizzazione del database
sequelize.sync({ force: false, alter: true })
    .then(() => {
        console.log(`Sincronizzazione effettuata!`);
    })
    .catch(err => {
        console.error(`Errore durante la sincronizzazione:`, err);
    });

// Avvio del server
const port = 3000;

app.listen(port, () => {
    console.log(`Server in ascolto alla porta ${port}`);
});
