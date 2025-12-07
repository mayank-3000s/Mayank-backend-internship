const Product = require('../models/Product');

exports.getAllProducts = async(req, res, next)=> {
    try{
        const response = await Product.find().select("-__v");
        if(response) return res.status(200).json(response);
        const err = new Error();
        next(err);
    } catch(err) {
        next(err);
    }
}

exports.getProduct = async(req, res, next)=> {
    try{
        const _id = req.params.id ;
        const response = await Product.find({_id}).select("-__v");
        if(response && response.length !==0) return res.status(200).json(response);
        res.status(404).json({message: "No such data found"});
    } catch(err) {
        next(err);
    }
} 

exports.createProduct = async(req, res, next) => {
    try{
        const data = req.body;
        const newProduct = Product(data);
        const response = await newProduct.save();
        if(response) return res.status(200).json({success: true, response});
        const err = new Error();
        next(err);
    } catch(err) {
        next(err);
    }
}
exports.deleteProduct = async(req, res, next) => {
    try{
        const _id = req.params.id;
        const response = await Product.findOneAndDelete({_id});
        if(response)  return res.status(200).json({success: true, message: "deleted ⛔"});
        const err = new Error();
        next(err);
    } catch(err) {
        next(err);
    }
}
exports.updateProduct = async(req, res, next) => {
    try{
        const _id = req.params.id;
        const data = req.body;
        const response = await Product.findByIdAndUpdate(_id, data, {new: true});
        if(response)  return res.status(200).json({success: true, response});
        const err = new Error();
        next(err);
    } catch(err) {
        next(err);
    }
}