const { verifyToken, verifyTokenAuthorization, verifyTokenIsAdmin } = require('./verifyToken');
const Cart = require('../models/Cart');
const router = require('express').Router();

// CREATE CART
router.post("/",verifyToken, async (req,res)=>{
    const newCart = new Cart(req.body);
    try
    {
        const savedCart = await newCart.save();
        return res.status(200).json(savedCart);
    }catch(err)
    {
        return res.status(500).json({msg14:"Internal Server Error!",err});
    }
});

// UPDATE CART
router.put("/:id",verifyTokenAuthorization,async(req,res)=>{
    try
    {
        const updatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body
            },
            {new:true}
        );
        return res.status(200).json(updatedCart);
    }catch(err)
    {
        return res.status(500).json({msg32:"Internal Server Error!",err});
    }
});

// DELETE CART
router.delete("/:id",verifyTokenAuthorization,async (req,res)=>{
    try
    {
        await Cart.findByIdAndDelete(req.params.id);
        return res.json(200).json({msg41:"Cart with ID: " + req.params.id + " has been deleted!"});
    }catch(err)
    {
        return res.status(500).json({msg43:"Internal Server Error!",err});
    }
});

// GET USER CART
router.get("/find/:userId",verifyTokenAuthorization,async(req,res)=>{
    try
    {
        const cart = await Cart.findOne({usuerId: req.params.userId});
        return res.status(200).json(cart);
    }catch(err)
    {
        return res.status(500).json({msg57:"Internal Server Error!",err});
    }
});

// GET ALL CARTS
router.get("/",verifyTokenIsAdmin,async(req,res)=>{
    try
    {
        const carts = await Cart.find();
        return res.status(200).json(carts);
    }catch(err)
    {
        return res.status(500).json({msg69:"Internal Server Error!",err});
    }
});

module.exports = router;
