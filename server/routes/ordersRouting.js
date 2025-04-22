const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

// Rotte per gli ordini
router.post('/', orderController.createOrder);  
router.get('/', orderController.getOrders);
router.get('/:id', orderController.getOrderByID);
router.delete('/:id', orderController.updateOrder);
router.put('/:id', orderController.completeOrder);

module.exports = router;