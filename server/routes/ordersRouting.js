const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

// Rotte per gli ordini
router.post('/items', orderController.createOrder);  
router.get('/', orderController.getOrders);
router.delete('/:orderId', orderController.updateOrder);
router.put('/:orderId', orderController.completeOrder);
router.get('/:orderId', orderController.getOrderByID);


module.exports = router;