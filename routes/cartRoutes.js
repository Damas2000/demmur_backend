const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/add', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getCartItems);
router.put('/update', authMiddleware, cartController.updateCartItem);
router.delete('/remove', authMiddleware, cartController.removeFromCart);
router.get('/count', authMiddleware, cartController.getCartCount);
router.delete('/cart', authMiddleware, async (req, res) => {
  try {
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: [] } },
      { new: true }
    );
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error: error.message });
  }
});

router.delete('/clear', authMiddleware, cartController.clearCart);

module.exports = router;
