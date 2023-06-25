const express = require('express');
const { Product } = require('../model/product');
const mongoose = require('mongoose');
const productRouter = express.Router();
const admin = require('../middleware/admin');
const Cart = require('../model/cart');
const User = require('../model/auth');
const auth = require('../middleware/auth');

productRouter.post('/admin/add-product', admin, async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body;

    let products = new Product({
      name,
      description,
      price,
      category,
      image,
    });
    products = await products.save();

    res.json(products);
  } catch (e) {
    res.status(500).json({ e: e.message });
  }
});
productRouter.post('/admin/get-product', admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (e) {
    res.status(500).json({ e: e.message });
  }
});

productRouter.delete('/admin/product/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedProduct = await Product.findByIdAndDelete(productId);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
productRouter.get('/api/product', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 11;

  try {
    const products = await Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// add to cart
productRouter.post('/users/:userId/cart', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productId = req.body.productId;
    const quantity = parseInt(req.body.quantity);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    user.cart.items.push({
      productId: product._id,
      quantity: quantity,
    });

    await user.save();
    return res.json({ message: 'Product added to cart' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Add a product to user's favorites
productRouter.post('/users/:userId/favorites/:productId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const productId = req.params.productId;

    if (user.favorites.includes(productId)) {
      return res.status(400).json({ message: 'Product already favorited' });
    }

    user.favorites.push(productId);
    await user.save();

    return res.json(user.favorites);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});
// get favorite
productRouter.get('/api/users/:userId/favorites', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteProductIds = user.favorites;

    const favoriteProducts = await Product.find({
      _id: { $in: favoriteProductIds },
    }).select('name price image');

    return res.json(favoriteProducts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});
// get cart
productRouter.get('/users/:userId/cart', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      'cart.items.productId'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const cartItems = user.cart.items;

    const products = cartItems.map((item) => ({
      id: item.productId._id,
      name: item.productId.name,
      price: item.productId.price,
      image: item.productId.image,
      quantity: item.quantity,
    }));

    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = productRouter;
