const Banner = require('../models/Banner');
const { cloudinary } = require('../config/cloudinaryConfig');

exports.addBanner = async (req, res) => {
    try {
        const { title, description } = req.body;

        let imageUrl = '';
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: "image", folder: "banners" },
                    (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            imageUrl = result.secure_url;
        }

        const banner = new Banner({
            title,
            description,
            imageUrl
        });

        await banner.save();
        res.status(201).json(banner);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getBanners = async (req, res) => {
    try {
        const banners = await Banner.find();
        res.json(banners);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
