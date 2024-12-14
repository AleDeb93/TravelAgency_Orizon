const Users = require('../models/Users');

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
            const newUser = await User.create(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: 'Errore durante la chiamata createUser' });
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