const { verifyToken, verifyTokenAuthorization } = require('./verifyToken');
const User = require('../models/User');
const cryptoJS = require('crypto-js');
const router = require('express').Router();

// UPDATE
// in this router we are calling the verifyToken middleware
// before calling the actual function
router.put('/update/:id', verifyTokenAuthorization, async (req, res) => {
  if (req.body.password) {
        //encryp the new password set
        req.body.password = cryptoJS.AES.encrypt(req.body.password, process.env.SKEY).toString();
  }

  try
  {
    // find the user by id and update the database
    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        // using $set it will automatically map everything from the request body
        $set:req.body
    },
        //this will return the updated data instead of the sent request
        {new:true}
    )
    return res.status(200).json({msg:"Update Success!",user:updatedUser});
  }catch(err)
  {
    return res.status(500).json({msg27:err})
  }
});

module.exports = router;
