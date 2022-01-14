const router = require('express').Router();
const User = require('../models/User');
const cryptoJS = require('crypto-js');
const dotenv = require('dotenv');
const jwtoken = require('jsonwebtoken');
dotenv.config();

// REGISTER END POINT
router.post('/register', async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    lname:req.body.lname,
    fname:req.body.fname,
    dob:req.body.dob,
    password: cryptoJS.AES.encrypt(req.body.password, process.env.SKEY).toString(),
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// LOGIN END POINT
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({ msg25: 'Invalid Credentials' });
    } else {
      const decryptedPass = cryptoJS.AES.decrypt(user.password, process.env.SKEY).toString(cryptoJS.enc.Utf8);
      if (req.body.password !== decryptedPass) {
        return res.status(401).send({ msg30: 'Invalid Credentials' });
      }
      //create a json web token for the user
      const accessToken = jwtoken.sign(
        {
          id: user._id.toString(),
          isAdmin: user.isAdmin,
        },
        process.env.JWTKEY,
        { expiresIn : "3d"}
      );

      // destructure the user doc from mongodb and remove password, only return remaning properties
      const { password, ...remainingFields } = user._doc;
      return res.status(200).json({...remainingFields,accessToken});
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
});

module.exports = router;
