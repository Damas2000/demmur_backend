const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');
const authMiddleware = require('../middlewares/authMiddleware');
// Favori ürünleri ekle/kontrol et
router.get('/check/:productId', authMiddleware, favoritesController.checkIfFavorite);
router.post('/add', authMiddleware, favoritesController.addToFavorites);
router.delete('/remove', authMiddleware, favoritesController.removeFromFavorites);
// Favori ürünleri listeleme
router.get('/', authMiddleware, favoritesController.getFavorites);

module.exports = router;