const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const User = require('../models/User');

router.get('/admin/dashboard', async (req, res) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments();
    console.log('Total Customers:', totalCustomers);
    const totalProducts = await Product.countDocuments();
    const totalCollections = await Collection.countDocuments();

    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          sales: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
      { $project: { name: '$_id', sales: 1, _id: 0 } }
    ]);

    const productData = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          value: { $sum: '$items.quantity' }
        }
      },
      { $sort: { value: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $project: {
          name: { $arrayElemAt: ['$productInfo.name', 0] },
          value: 1
        }
      }
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name')
      .lean();

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      totalCustomers,
      totalProducts,
      totalCollections,
      salesData,
      productData,
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        customer: order.user?.name || 'Bilinmeyen Müşteri',
        date: order.createdAt.toISOString().split('T')[0],
        amount: order.totalAmount,
        status: order.status || 'Bilinmiyor'
      }))
    });
  } catch (error) {
    console.error('Dashboard verisi alınırken hata oluştu:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

module.exports = router;