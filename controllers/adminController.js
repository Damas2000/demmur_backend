// adminController.js

const Banner = require('../models/Banner');

const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, stock, imageUrl } = req.body;
        const newProduct = new Product({ name, price, description, stock, imageUrl });
        const product = await newProduct.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};
exports.addBanner = async (req, res) => {
  const { title, imageUrl, link } = req.body;
  try {
    const banner = new Banner({ title, imageUrl, link });
    await banner.save();
    res.json({ msg: 'Banner added successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
