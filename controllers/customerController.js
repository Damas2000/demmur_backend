// controllers/customerController.js
const User = require('../models/User');
const Order = require('../models/Order');

exports.getCustomers = async (req, res) => {
    try {
        const customers = await User.find();
        const customersWithOrders = await Promise.all(customers.map(async customer => {
            const orders = await Order.find({ user: customer._id });
            return { ...customer._doc, orders };
        }));
        res.json(customersWithOrders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
