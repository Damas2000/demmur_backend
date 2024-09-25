const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Add or update a product in the cart
exports.addToCart = async (req, res) => {
  try {
      const { productId, quantity, size, color } = req.body;

      if (!color) {
          return res.status(400).json({ message: 'Color is required' });
      }

      const product = await Product.findById(productId);
      if (!product) {
          return res.status(404).json({ message: 'Product not found' });
      }

      const userId = req.user.id;
      if (!userId) {
          return res.status(401).json({ message: 'User not authenticated' });
      }

      let cart = await Cart.findOne({ userId });
      if (!cart) {
          cart = new Cart({ userId, items: [] });
      }

      const existingItemIndex = cart.items.findIndex(
          (item) => item.productId.toString() === productId && item.size === size && item.color === color
      );

      if (existingItemIndex >= 0) {
          cart.items[existingItemIndex].quantity += quantity;
      } else {
          cart.items.push({ productId, quantity, size, color });
      }

      await cart.save();
      res.status(201).json(cart);
  } catch (error) {
      console.error('Error adding product to cart:', error);
      res.status(500).json({ message: 'Server Error' });
  }
};

// Get cart items
exports.getCartItems = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart items:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update cart item quantity
exports.updateCartItem = async (req, res) => {
    try {
        const { productId, size, quantity } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(
            (item) => item.productId.toString() === productId && item.size === size
        );

        if (item) {
            if (quantity > 0) {
                item.quantity = quantity;
            } else {
                cart.items = cart.items.filter(
                    (item) => item.productId.toString() !== productId || item.size !== size
                );
            }
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json({ message: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Remove an item from the cart
exports.removeFromCart = async (req, res) => {
    try {
        const { productId, size } = req.body;
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId || item.size !== size
        );

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing item from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get cart count
exports.getCartCount = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        const count = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
        res.json({ count });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const userId = req.user.id;
        await Cart.findOneAndUpdate(
            { user: userId },
            { $set: { items: [] } },
            { new: true }
        );
        res.status(200).json({ message: 'Cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
