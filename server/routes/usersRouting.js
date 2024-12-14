const userController = require("../controllers/userController");

const express = require('express');
const router = express.Router();


// Rotte per gestire gli utenti
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserByID);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;