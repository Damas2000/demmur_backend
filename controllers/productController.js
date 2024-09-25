const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinaryConfig');
const Collection = require('../models/Collection');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, stock, collection, sizes, colors } = req.body;
        let mainImageUrl = '';
        const imageUrls = [];

        console.log('Gelen dosyalar:', req.files);

        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const base64Image = file.buffer.toString('base64');
                    const dataURI = `data:${file.mimetype};base64,${base64Image}`;
                    
                    const result = await cloudinary.uploader.upload(dataURI, {
                        resource_type: "auto"
                    });
                    imageUrls.push(result.secure_url);
                } catch (uploadError) {
                    console.error('Resim yüklenirken hata:', uploadError);
                }
            }
            mainImageUrl = imageUrls[0] || '';
        }

        const newProduct = new Product({
            name,
            price,
            description,
            stock,
            collection,
            sizes: JSON.parse(sizes),
            colors: JSON.parse(colors),
            imageUrls,
            mainImageUrl
        });

        const savedProduct = await newProduct.save();
        
        if (collection) {
            await Collection.findByIdAndUpdate(
                collection,
                { $push: { products: savedProduct._id } },
                { new: true }
            );
        }

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Ürün eklenirken hata:', error);
        res.status(500).json({ message: 'Ürün eklenirken bir hata oluştu', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const { name, price, description, stock, collection, sizes, colors } = req.body;
        let mainImageUrl = product.mainImageUrl;
        const imageUrls = product.imageUrls.slice();

        if (req.files) {
            for (const file of req.files) {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { resource_type: "image", folder: "products" },
                        (error, result) => {
                            if (error) reject(error);
                            resolve(result);
                        }
                    );
                    uploadStream.end(file.buffer);
                });
                imageUrls.push(result.secure_url);
            }
            mainImageUrl = imageUrls[0];
        }

        const updatedProduct = {
            name,
            price,
            description,
            stock,
            collection,
            sizes: JSON.parse(sizes),
            colors: JSON.parse(colors),
            mainImageUrl,
            imageUrls
        };

        await Product.findByIdAndUpdate(req.params.id, updatedProduct, { new: true });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        res.json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getProductsByCollection = async (req, res) => {
    try {
        const products = await Product.find({ collection: req.params.collectionName });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getSimilarProducts = async (req, res) => {
    try {
        const { id, name, description } = req.query;
        
        if (!id || !name || !description) {
            return res.status(400).json({ message: 'Missing required parameters' });
        }

        const similarProducts = await Product.find({
            _id: { $ne: id },
            $or: [
                { name: { $regex: name.split(' ')[0], $options: 'i' } },
                { description: { $regex: description.split(' ')[0], $options: 'i' } }
            ]
        }).limit(3);

        res.json(similarProducts);
    } catch (error) {
        console.error('Error fetching similar products:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, price, description, stock, collection, sizes, colors, mainImageIndex } = req.body;
        let imageUrls = [];

        if (req.files && req.files.images) {
            const uploadPromises = req.files.images.map(file => 
                cloudinary.uploader.upload(file.path)
            );
            const uploadResults = await Promise.all(uploadPromises);
            imageUrls = uploadResults.map(result => result.secure_url);
        } else {
            // Eğer resim yoksa, varsayılan bir resim URL'si ekleyebilirsiniz
            // imageUrls = ['https://example.com/default-product-image.jpg'];
            console.warn('Ürüne resim eklenmedi!');
        }

        const newProduct = new Product({
            name,
            price,
            description,
            stock,
            imageUrls,
            collection,
            sizes: JSON.parse(sizes),
            colors: JSON.parse(colors),
            mainImageUrl: imageUrls[mainImageIndex] || imageUrls[0]
        });

        const savedProduct = await newProduct.save();

        // Koleksiyona ürünü ekle
        await Collection.findByIdAndUpdate(
            collection,
            { $push: { products: savedProduct._id } },
            { new: true }
        );

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Ürün eklenirken hata:', error);
        res.status(500).json({ message: 'Ürün eklenirken bir hata oluştu', error: error.message });
    }
};
