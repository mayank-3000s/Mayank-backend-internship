const { RiDice1Fill } = require('react-icons/ri');
const Product = require('../models/Product');

exports.getAllProducts = async(req, res, next)=> {
    try{
        let {sort, category, name, page, limit} = req.query;
        console.log(req.query, sort);
        let Objectquery = {}; 
        if(category) {
            Objectquery.category = {$regex: category, $options: 'i'}; // regex
        }
        
        if(name) {
            Objectquery.product_name = {$regex: name, $options : 'i'};
        }
        let apidata = Product.find(Objectquery);
        if(page) {                      // paging
            let _page = Number(req.query.page) || 1;
            let _limit = Number(req.query.limit) || 5;
            let skip = (page-1) * limit;
            apidata = apidata.skip(skip).limit(limit);
        }
        if(sort) {
            apidata = apidata.sort(sort); // sort
        }
        const response = await apidata.select("-__v");
        if(response) return res.status(200).json({response, nbHit: response.length});
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