const Collection = require('../models/Collection');
const uploadImage = require('../utils/uploadImage');
const { cloudinary } = require('../config/cloudinaryConfig');

exports.getCollections = async (req, res) => {
    try {
        const collections = await Collection.find();
        res.json(collections);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getCollectionById = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) return res.status(404).json({ message: 'Collection not found' });
        res.json(collection);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addCollection = async (req, res) => {
    try {
        let imageUrl = '';
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'collections'
            });
            imageUrl = result.secure_url;
        } else {
            return res.status(400).json({ message: 'Resim dosyası gerekli' });
        }

        const collection = new Collection({
            name: req.body.name,
            description: req.body.description,
            imageUrl: imageUrl
        });

        await collection.save();
        res.status(201).json(collection);
    } catch (error) {
        console.error('Koleksiyon eklenirken hata:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

exports.updateCollection = async (req, res) => {
    try {
        const collection = await Collection.findById(req.params.id);
        if (!collection) return res.status(404).json({ message: 'Collection not found' });

        let imageUrl = collection.imageUrl;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'collections'
            });
            imageUrl = result.secure_url;
        }

        const updatedCollection = {
            name: req.body.name || collection.name,
            description: req.body.description || collection.description,
            imageUrl
        };

        const result = await Collection.findByIdAndUpdate(req.params.id, updatedCollection, { new: true });
        res.json(result);
    } catch (error) {
        console.error('Koleksiyon güncellenirken hata:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteCollection = async (req, res) => {
    try {
        const collection = await Collection.findByIdAndDelete(req.params.id);
        if (!collection) return res.status(404).json({ message: 'Collection not found' });

        res.json({ message: 'Collection deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
