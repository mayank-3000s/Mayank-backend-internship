const mongoose = require('mongoose');
const newProductSchema = mongoose.Schema({
    product_name: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String
    },
    stock: {
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const Product = mongoose.model('Product', newProductSchema);

module.exports = Product;