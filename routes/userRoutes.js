const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/profile', authMiddleware, userController.getUserProfile);
router.get('/favorites', authMiddleware, userController.getFavorites);
router.get('/addresses', authMiddleware, userController.getAddresses);
router.get('/payment-methods', authMiddleware, userController.getPaymentMethods);
router.put('/profile', authMiddleware, userController.updateProfile);
router.post('/addresses', authMiddleware, userController.addAddress);
router.post('/payment-methods', authMiddleware, userController.addPaymentMethod);


module.exports = router;
