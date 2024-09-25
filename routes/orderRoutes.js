const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

// Sipariş oluşturma
router.post('/', authMiddleware, orderController.createOrder);

// Tüm siparişleri listeleme
router.get('/', authMiddleware, orderController.getAllOrders);
router.get('/user', authMiddleware, orderController.getUserOrders);
router.get('/:orderId', authMiddleware, orderController.getOrderById);


module.exports = router;
