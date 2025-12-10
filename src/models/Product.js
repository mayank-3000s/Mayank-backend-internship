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
    },
    image: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Product = mongoose.model('Product', newProductSchema);

module.exports = Product;