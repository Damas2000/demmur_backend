const Favorite = require('../models/favorites');
const Product = require('../models/Product');


// Favori durumu kontrol etme
exports.checkIfFavorite = async (req, res) => {
    try {
        console.log('checkIfFavorite çağrıldı:', req.params, 'User:', req.user);
        const { productId } = req.params;
        const userId = req.user.id;
        const favorite = await Favorite.findOne({ userId, products: productId });
        res.status(200).json({ isFavorite: !!favorite });
    } catch (error) {
        console.error('Favori durumu kontrol edilirken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Favorilere ürün ekleme
exports.addToFavorites = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;
        let favorite = await Favorite.findOne({ userId });
        if (!favorite) {
            favorite = new Favorite({ userId, products: [] });
        }
        if (!favorite.products.includes(productId)) {
            favorite.products.push(productId);
            await favorite.save();
        }
        res.status(200).json({ success: true, message: 'Ürün favorilere eklendi' });
    } catch (error) {
        console.error('Favorilere eklerken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Favorilerden ürün çıkarma
exports.removeFromFavorites = async (req, res) => {
    try {
        const { productId } = req.body;
        const userId = req.user.id;
        const favorite = await Favorite.findOne({ userId });
        if (favorite) {
            favorite.products = favorite.products.filter(id => id.toString() !== productId);
            await favorite.save();
        }
        res.status(200).json({ success: true, message: 'Ürün favorilerden çıkarıldı' });
    } catch (error) {
        console.error('Favorilerden çıkarırken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorite = await Favorite.findOne({ userId }).populate('products');

        if (!favorite) {
            return res.status(200).json([]);
        }

        res.status(200).json(favorite.products);
    } catch (error) {
        console.error('Favori ürünler getirilirken hata:', error);
        res.status(500).json({ message: 'Favori ürünler alınırken hata oluştu', error: error.message });
    }
};

// Favori ürünleri sayısını döndürme
exports.getFavoritesCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorite = await Favorite.findOne({ userId });
        const count = favorite ? favorite.products.length : 0;
        res.json({ count });
    } catch (error) {
        console.error('Favori sayısı alınırken hata:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
