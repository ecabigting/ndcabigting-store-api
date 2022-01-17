const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    productname: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String, required: true },
    categories: { type: Array},
    size: { type: String},
    color: { type: String},
    price: { type: Number },
    createdBy: {type: String, required: true}
  },
  { timestamps: true } // if set to true automatically creates the createdAt and updatedAt field
);

module.exports = mongoose.model('Product', ProductSchema);
