const { verifyToken, verifyTokenAuthorization, verifyTokenIsAdmin } = require('./verifyToken');
const Product = require('../models/Product');
const cryptoJS = require('crypto-js');
const router = require('express').Router();

// ADD Product
router.post("/",verifyTokenIsAdmin, async(req,res)=>{
    const newProduct = new Product({
        productname: req.body.productname,
        desc: req.body.desc,
        img: req.body.img,
        categories: req.body.categories,   
        size: req.body.size,
        color: req.body.color,
        price: req.body.price,
        createdBy: req.user.id
      });
    
      try {
        const saveProduct = await newProduct.save();
        res.status(201).json(saveProduct);
      } catch (err) {
        res.status(500).json(err);
      }
});

// Update Product

// Delete Product

// Get Product by ID



module.exports = router;