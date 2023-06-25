const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    image: [{ type: String, required: true }],
  },
  { timestamps: true }
);
productSchema.pre('save', function (next) {
  if (this.price % 1 === 0) {
    // If the price is an integer, set it as a double
    this.price = parseFloat(this.price.toFixed(1));
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = { Product, productSchema };
