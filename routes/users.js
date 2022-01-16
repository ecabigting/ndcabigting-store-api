const { verifyToken, verifyTokenAuthorization, verifyTokenIsAdmin } = require('./verifyToken');
const User = require('../models/User');
const cryptoJS = require('crypto-js');
const router = require('express').Router();

// GET USER STATS
router.get('/stats/', verifyTokenIsAdmin, async (req, res) => {
  const date = new Date();
  console.log("-- stats --")
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);
    return res.status(200).json(data);
  } catch (err) {
    console.log(err);
    return res.status(500).json({msg91:"Internal server Error!",err});
  }
});

// UPDATE
// in this router we are calling the verifyToken middleware
// before calling the actual function
router.put('/:id', verifyTokenAuthorization, async (req, res) => {
  if (req.body.password) {
    //encryp the new password set
    req.body.password = cryptoJS.AES.encrypt(req.body.password, process.env.SKEY).toString();
  }

  try {
    // find the user by id and update the database
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        // using $set it will automatically map everything from the request body
        $set: req.body,
      },
      //this will return the updated data instead of the sent request
      { new: true }
    );
    return res.status(200).json({ msg: 'Update Success!', user: updatedUser });
  } catch (err) {
    return res.status(500).json({ msg27: err });
  }
});

// DELETE USER
router.delete('/:id', verifyTokenAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ msg37: 'User with id:' + req.params.id + ' has been deleted!' });
  } catch (err) {
    return res.status(500).json({ msg38: 'Internal Server Error!', error: err });
  }
});

// // GET USER
router.get('/:id', verifyTokenIsAdmin, async (req, res) => {
  try {
    const foundUser = await User.findById(req.params.id);
    // destructure the user doc from mongodb and remove password, only return remaning properties
    const { password, ...remainingFields } = foundUser._doc;
    return res.status(200).json(remainingFields);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg51: 'Internal Server Error!', err });
  }
});

// GET ALL USER
router.get('/', verifyTokenIsAdmin, async (req, res) => {
  // using query in the request url
  const query = req.query.new;
  try {
    // if query is true only send the 5 latest users
    // using sort with createdAt parameter -1 returns users sorted by created date desc. passing 1 is asc
    const userList = query ? await User.find().sort({ createdAt: -1 }).limit(5) : await User.find();
    return res.status(200).json(userList);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ msg66: 'Internal Server Error!', err });
  }
});

module.exports = router;
