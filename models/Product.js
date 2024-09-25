const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    stock: { type: Number, required: true },
    mainImageUrl: { type: String },
    imageUrls: { type: [String] },
    collection: { type: String },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] } // Renkler alanı eklendi
});

// Eğer model zaten tanımlandıysa tekrar tanımlama, tanımlanmadıysa tanımla
module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
