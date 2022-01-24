const { verifyToken, verifyTokenAuthorization, verifyTokenIsAdmin } = require('./verifyToken');
const Order = require('../models/Order');
const router = require('express').Router();

// Get Monthly Income
router.get('/income/', verifyTokenIsAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const prevMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
  
    try {
      const income = await Order.aggregate([
        {
          $match: { createdAt: { $gte: prevMonth } },
        },
        {
          $project: {
            month: { $month: '$createdAt' },
            sales: '$amount',
          },
        },
        {
          $group: {
            _id: '$month',
            total: { $sum: $sales },
          },
        },
      ]);
      return res.status(200).json(income);
    } catch (err) {
      return res.status(500).json({ msg74: 'Internal Server Error!', err });
    }
  });

// CREATE New Order
router.post('/', verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    return res.status(200).json(savedOrder);
  } catch (err) {
    return res.status(500).json({ msg14: 'Internal Server Error!', err });
  }
});

// UPDATE Order
router.put('/:id', verifyTokenIsAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).json(updatedOrder);
  } catch (err) {
    return res.status(500).json({ msg32: 'Internal Server Error!', err });
  }
});

// DELETE Order
router.delete('/:id', verifyTokenIsAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.json(200).json({ msg41: 'Order with ID: ' + req.params.id + ' has been deleted!' });
  } catch (err) {
    return res.status(500).json({ msg43: 'Internal Server Error!', err });
  }
});

// GET USER Order
router.get('/find/:userId', verifyTokenAuthorization, async (req, res) => {
  try {
    const orders = await Order.Find({ usuerId: req.params.userId });
    return res.status(200).json(Order);
  } catch (err) {
    return res.status(500).json({ msg57: 'Internal Server Error!', err });
  }
});

// GET ALL Order
router.get('/', verifyTokenIsAdmin, async (req, res) => {
  try {
    const order = await Order.find();
    return res.status(200).json(Order);
  } catch (err) {
    return res.status(500).json({ msg69: 'Internal Server Error!', err });
  }
});

module.exports = router;
