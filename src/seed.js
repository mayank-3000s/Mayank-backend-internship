const mongoose = require('mongoose');

const products = require('./json/products.json');
const Product = require('./models/Product');
const { mongoUrl } = require('../env');

const seed = async(req, res, next) => {
    try{
        await mongoose.connect(mongoUrl);

        // delete prev data => deleteMany
        await Product.deleteMany();

        // insert => insertMany()
        await Product.insertMany(products);

        console.log('products imported successfully');
    } catch(err) {
        next(err);
    }
}

seed();