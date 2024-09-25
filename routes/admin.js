// routes/admin.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { auth, admin } = require('../middlewares/authMiddleware');

router.post('/add-product', adminController.addProduct);

module.exports = router;
