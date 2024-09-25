const Order = require('../models/Order');
const mongoose = require('mongoose');
exports.createOrder = async (req, res) => {
    try {
        const { phoneNumber, cartItems, totalAmount } = req.body;
        const order = new Order({
            user: req.user.id,
            items: cartItems,
            phoneNumber,
            totalAmount,
            status: 'Pending' // Siparişin durumunu "Beklemede" olarak ayarlayalım
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Tüm siparişleri getir
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.productId').populate('user');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const orderId = req.params.orderId;

        // `orderId`'nin geçerli bir `ObjectId` olup olmadığını kontrol edin
        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ message: 'Geçersiz sipariş ID' });
        }

        const order = await Order.findById(orderId).populate('user', 'name email').populate('items.productId', 'name imageUrl');

        if (!order) {
            return res.status(404).json({ message: 'Sipariş bulunamadı' });
        }

        res.json(order);
    } catch (error) {
        console.error('Sipariş alınırken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};


exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId }).populate('items.productId', 'name imageUrl');
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

