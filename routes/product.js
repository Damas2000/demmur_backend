const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload } = require('../config/multerConfig');

router.get('/similar', productController.getSimilarProducts);
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/collection/:collectionName', productController.getProductsByCollection); // Koleksiyon ürünlerini getirme rotası
router.post('/', upload.array('images', 5), productController.addProduct);
router.put('/:id', upload.array('images', 5), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
