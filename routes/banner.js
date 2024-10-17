const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { upload } = require('../middlewares/multer');

router.post('/', upload.single('image'), bannerController.addBanner);
router.get('/', bannerController.getBanners);
router.delete('/:id', bannerController.deleteBanner);
router.put('/:id', upload.single('image'), bannerController.updateBanner);


module.exports = router;
