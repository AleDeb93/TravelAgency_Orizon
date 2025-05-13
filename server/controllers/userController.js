const Users = require('../models/Users');   
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Variabili d'ambiente
require('dotenv').config();

const userController = {
    // GET /api/v2/users
    getAllUsers: async (req, res) => {
        try {
            const users = await Users.findAll({ attributes: { exclude: ['password_hash'] } });
            res.status(200).json(users);
        } catch (error) {
            console.error("Errore durante la chiamata getAllUsers:", error.message); // Log dell'errore con il messaggio
            console.error("Stack Trace:", error.stack); // Log della stack trace dell'errore
            res.status(500).json({ error: 'Errore durante la chiamata getAllUsers', details: error.message });
        }
    },
    
    
    // GET /api/v2/users/:id
    getUserByID: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await Users.findByPk(id, { attributes: { exclude: ['password_hash'] } });
            if (user)
                res.status(200).json(user)
            else
                res.status(404).json({ error: 'Utente non trovato' })
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata getUserByID' });
        }
    },

    // GET /api/v2/users/verify-token
    verifyToken: async (req, res) => {
        console.log(`[${new Date().toLocaleString()}] Verifica token in corso`);
        const authHeader = req.headers.authorization;
        if(!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token non fornito' });
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return res.status(200).json({ message: 'Token valido', userId: decoded.id });
          } catch (error) {
            console.error('Errore verifica token:', error.message);
            return res.status(401).json({ error: 'Token non valido o scaduto' });
          }
    },

    // POST /api/v2/users
    createUser: async (req, res) => {
        try {
            // Estraggo i dati obbligatori dalla richiesta
            const { name, surname, email, gender, country, city, street, password } = req.body;
            // Genero il salt per l' hashing e poi creo il nuovo user usando la psw criptata 
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);
            // Creo il nuovo utente
            const newUser = await Users.create({
                name,
                surname,
                email,
                gender,
                country,
                city,
                street,
                password_hash
            })
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata createUser' });
        }
    },

    // POST /api/v2/login
    loginUser: async (req, res) => {
        try {
            const { email, password } = req.body;
            // Cerco l'utente nel database
            const user = await Users.findOne({ where: { email } });
            // Se l'utente non esiste
            if (!user)
                return res.status(404).json({ error: 'Email non registrata' });
            // Verifico la password
            const match = await bcrypt.compare(password, user.password_hash);
            // Se la password non corrisponde
            if (!match)
                return res.status(401).json({ error: 'Password errata!' });
            // Login riuscito, genero il token
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
            res.status(200).json({ message: 'Login riuscito', token, user });
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la login' });
        }
    },

    // PUT /api/v2/users/:id
    updateUser: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await Users.findByPk(id);
            if (user) {
                await user.update(req.body);
                res.status(200).json(user);
            } else {
                res.status(404).json({ error: 'Utente non trovato' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata updateUser' });
        }
    },

    // DELETE /api/v2/users/:id
    deleteUser: async (req, res) => {
        const { id } = req.params;
        try {
            const deleted = await Users.destroy({ where: { id } });
            if (deleted) {
                res.status(200).json({ message: 'Utente eliminato' });
            } else {
                res.status(404).json({ error: 'Utente non trovato' });
            }
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata deleteUser' });
        }
    }
}

module.exports = userController;