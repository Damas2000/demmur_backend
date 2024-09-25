// routes/collection.js
const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/', collectionController.getCollections);
router.get('/:id', collectionController.getCollectionById);
router.post('/', upload.single('image'), collectionController.addCollection);
router.put('/:id', upload.single('image'), collectionController.updateCollection);
router.delete('/:id', collectionController.deleteCollection);

module.exports = router;
