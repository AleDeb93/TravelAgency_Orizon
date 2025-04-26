const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

// Rotte per gli ordini
router.post('/items', orderController.createOrder);  
router.get('/', orderController.getOrders);
// Rotte per ordini specifici
router.get('/:orderId', orderController.getOrderByID);
router.put('/:orderId', orderController.updateOrder);
router.patch('/:orderId', orderController.completeOrder);
router.delete('/:orderId', orderController.deleteOrder);

module.exports = router;