const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const Category = mongoose.model('Catgory', categorySchema);

module.exports = Category;
