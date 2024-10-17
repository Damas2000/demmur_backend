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
exports.deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const banner = await Banner.findByIdAndDelete(id);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Optionally, remove the image from cloud storage if necessary
        // if (banner.imageUrl) {
        //     const publicId = banner.imageUrl.split('/').pop().split('.')[0];
        //     await cloudinary.uploader.destroy(`banners/${publicId}`);
        // }

        res.json({ message: 'Banner deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
// Update an existing banner
exports.updateBanner = async (req, res) => {
    try {
        const { title, description } = req.body;
        const banner = await Banner.findById(req.params.id);

        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        banner.title = title;
        banner.description = description;

        if (req.file) {
            // If a new image is uploaded, replace the old image
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
            banner.imageUrl = result.secure_url;
        }

        await banner.save();
        res.json(banner);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
