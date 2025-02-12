const userController = require("../controllers/userController");
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddlewares');

// Rotte per gestire gli utenti
router.get('/', userController.getAllUsers);
router.get('/:id', authMiddleware, userController.getUserByID);
router.post('/', userController.createUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);

// Rotta per il login
router.post('/login', userController.loginUser); 

module.exports = router;