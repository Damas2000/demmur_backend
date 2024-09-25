const Product = require('../models/Product');
const Collection = require('../models/Collection');

exports.search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Arama terimi gerekli' });
    }

    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    }).limit(10);

    const collections = await Collection.find({
      name: { $regex: query, $options: 'i' }
    }).limit(5);

    const productTypes = await Product.distinct('type', {
      type: { $regex: query, $options: 'i' }
    });

    res.json({
      products,
      collections,
      productTypes
    });
  } catch (error) {
    console.error('Arama hatası:', error);
    res.status(500).json({ message: 'Sunucu hatası' });
  }
};