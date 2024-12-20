const express = require('express');
const sequelize = require('./config/database');
const usersRouting = require('./routes/usersRouting'); 
const destinationsRouting = require('./routes/destinationsRouting');
const cors = require('cors');
const app = express();

// Middleware per parsare i JSON
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4200'
}));


// Definizione delle rotte
app.use('/api/v2/users', usersRouting);
app.use('/api/v2/destinations', destinationsRouting);

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
        console.log(`Tabelle sincronizzate correttamente!`);
    })
    .catch(err => {
        console.error(`Errore durante la sincronizzazione:`, err);
    });

// Avvio del server
const port = 3000;

app.listen(port, () => {
    console.log(`Server in ascolto alla porta ${port}`);
});
