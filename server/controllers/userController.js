const Users = require('../models/Users');
const bcrypt = require('bcrypt');
const { use } = require('../routes/usersRouting');

const userController = {
    // GET /api/v2/users
    getAllUsers: async (req, res) => {
        try {
            const users = await Users.findAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata getAllUsers' });
        }
    },
    // GET /api/v2/users/:id
    getUserByID: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await Users.findByPk(id);
            if (user)
                res.status(200).json(user)
            else
                res.status(404).json({ error: 'Utente non trovato' })
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata getUserByID' });
        }
    },
    // POST /api/v2/users
    createUser: async (req, res) => {
        try {
            // Estraggo i dati obbligatori dalla richiesta
            const { name, surname, email, password } = req.body;
            // Genero il salt per l' hashing e poi creo il nuovo user usando la psw criptata 
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);
            const newUser = await Users.create({
                name,
                surname,
                email,
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
            // Cerco l' utente nel database
            const user = await Users.findOne({ where: { email } });
            // Gestisco se non lo trovo 
            if (!user)
                return res.status(404).json({ error: 'Email non registrata' })
            // Verifico la psw
            const match = await bcrypt.compare(password, user.pswHash);
            // Gestisco errori di utente / psw
            if (!match)
                return res(401).json({ error: 'Password errata!' })
            // Login riuscito
            res.status(200).json({ message: 'Login riuscito', user })
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la login' });
        }
    },
    // PUT /api/v2/users/:id
    updateUser: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findByPk(id);
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
            const deleted = await User.destroy({ where: { id } });
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