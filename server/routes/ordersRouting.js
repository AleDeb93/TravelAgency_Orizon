const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddlewares');
const router = express.Router();

// Rotte per gli ordini
router.post('/', authMiddleware, orderController.createOrder);  
router.get('/', authMiddleware, orderController.getOrders);
router.get('/:id', authMiddleware, orderController.getOrderByID);
router.delete('/:id', authMiddleware, orderController.updateOrder);
router.put('/:id', authMiddleware, orderController.completeOrder);

module.exports = router;