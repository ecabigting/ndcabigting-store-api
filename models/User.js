const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    dob: {type: Date,required:true,default: new Date()}
  },
  { timestamps: true } // if set to true automatically creates the createdAt and updatedAt field
);

module.exports = mongoose.model('User', UserSchema);
