// userController.js
const User = require('../models/User');
const Order = require('../models/Order');
const Favorite = require('../models/favorites');

exports.getUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await Favorite.findOne({ userId }).populate('products');
        res.json(favorites ? favorites.products : []);
    } catch (error) {
        console.error('Favoriler alınırken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

exports.getAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        res.json(user.addresses);
    } catch (error) {
        console.error('Adresler alınırken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

exports.getPaymentMethods = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        res.json(user.paymentMethods);
    } catch (error) {
        console.error('Ödeme yöntemleri alınırken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

exports.updateProfile = async (req, res) => {
    try {
      const userId = req.user.id;
      const { firstName, lastName, phoneNumber, gender } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { firstName, lastName, phoneNumber, gender },
        { new: true, runValidators: true }
      ).select('-password');
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' });
      }
  
      res.json(updatedUser);
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      res.status(500).json({ message: 'Sunucu hatası' });
    }
  };

  exports.addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const newAddress = req.body;
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { addresses: newAddress } },
            { new: true, runValidators: true }
        ).select('-password');
        res.json(user.addresses[user.addresses.length - 1]);
    } catch (error) {
        console.error('Adres eklenirken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};

exports.addPaymentMethod = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cardNumber, expiryDate, cvv } = req.body;
        
        const lastFourDigits = cardNumber.slice(-4);
        const maskedCardNumber = '*'.repeat(cardNumber.length - 4) + lastFourDigits;
        
        const newPaymentMethod = {
            cardNumber: maskedCardNumber,
            expiryDate,
            cvv: '*'.repeat(cvv.length)
        };
        
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { paymentMethods: newPaymentMethod } },
            { new: true, runValidators: true }
        ).select('-password');
        
        res.json(user.paymentMethods[user.paymentMethods.length - 1]);
    } catch (error) {
        console.error('Ödeme yöntemi eklenirken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
};
