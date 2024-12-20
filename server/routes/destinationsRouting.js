const express = require('express');
const destinationController = require('../controllers/destinationController');
const router = express.Router();

// Rotte per le destinazioni
router.get('/', destinationController.getAllDestinations); 
router.get('/:id', destinationController.getDestinationByID); 

module.exports = router;
