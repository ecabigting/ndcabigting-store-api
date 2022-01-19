const { verifyToken, verifyTokenAuthorization, verifyTokenIsAdmin } = require('./verifyToken');
const Product = require('../models/Product');
const cryptoJS = require('crypto-js');
const router = require('express').Router();

// ADD Product
router.post('/', verifyTokenIsAdmin, async (req, res) => {
  const newProduct = new Product({
    productname: req.body.productname,
    desc: req.body.desc,
    img: req.body.img,
    categories: req.body.categories,
    size: req.body.size,
    color: req.body.color,
    price: req.body.price,
    createdBy: req.user.id,
    updatedBy: req.user.id,
  });

  try {
    const saveProduct = await newProduct.save();
    res.status(201).json(saveProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update Product
router.put('/:productID', verifyTokenIsAdmin, async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.productID);
    if (foundProduct) {
      const updatedProduct = await Product.findByIdAndUpdate(
        req.params.productID,
        {
          $set: req.body,
          updatedBy: req.user.id,
        },
        { new: true }
      );
      return res.status(200).json(updatedProduct);
    }
    return res.status(404).json({ msg37: 'Product with ID: ' + req.params.productID + ' not found!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg35: 'Error updating the product with id:' + req.params.productID, err });
  }
});

// Delete Product
router.delete('/:productID', verifyTokenIsAdmin, async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.productID);
    if (foundProduct) {
      if (foundProduct.createdBy === req.user.id) {
        await Product.findByIdAndDelete(req.params.productID);
        return res.status(200).json({ msg61: 'Product with Id:' + req.params.productID + ' deleted successfully!' });
      }
      return res.status(403).json({ msg63: 'Product with id: ' + req.params.productID + ' cannot be deleted!' });
    }
    return res.status(404).json({ msg65: 'Product with id: ' + req.params.productID + ' not found!' });
  } catch (err) {
    return res.status(500).json({ msg67: 'Internal Server Error!', error: err });
  }
});

// Get Product by ID
router.get('/:productID', verifyToken, async (req, res) => {
  try {
    const foundProduct = await Product.findById(req.params.productID);
    if (foundProduct) {
      return res.status(200).json(foundProduct);
    }
    return res.status(404).json({ msg79: 'Product with ID:' + req.params.productID + ' not found!' });
  } catch (err) {
    return res.status(500).json({ msg78: 'Internal Server Error!', err });
  }
});

// GET ALL Products
router.get('/', verifyTokenIsAdmin, async (req, res) => {
  // using query in the request url
  const qNew = req.query.new;
  const qCategory = req.query.productCategory;
  try {
    let products;
    
    if(qNew)
    {
      products = await Product.find().sort({createdAt: -1}).limit(5);
    }
    else if(qCategory)
    {
      products = await Product.find({categories:{$in:[qCategory]}});
    }else
    {
      products = await Product.find();
    }

    return res.status(200).json(products);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg66: 'Internal Server Error!', err });
  }
});

module.exports = router;
