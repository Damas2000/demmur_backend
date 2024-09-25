const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { upload } = require('../middlewares/multer');

router.post('/', upload.single('image'), bannerController.addBanner);
router.get('/', bannerController.getBanners);

module.exports = router;
