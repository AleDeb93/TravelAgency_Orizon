const express = require('express');
const destinationController = require('../controllers/destinationController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

// Rotte per le destinazioni
router.get('/', destinationController.getAllDestinations); 
router.get('/filters', authMiddleware, destinationController.getDestinationsByPreferences); //authMiddleware
router.get('/:id', destinationController.getDestinationByID); 

module.exports = router;
