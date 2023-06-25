const mongoose = require('mongoose');
const Product = require('./product');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
});
const Cart = mongoose.model('Cart', cartItemSchema);
module.exports = { Cart, cartItemSchema };
