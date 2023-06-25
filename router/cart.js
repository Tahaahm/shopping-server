const express = require('express');
const User = require('../model/auth');
const cartRouter = express.Router();

cartRouter.get('/users/:userId/cart', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate({
      path: 'cart.items.productId',
      select: 'name price image',
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json(user.cart.items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});
cartRouter.delete('/users/:userId/cart/:productId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const productId = req.params.productId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    const cartItemIndex = user.cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (cartItemIndex < 0) {
      return res.status(404).send({ error: 'Product not found in cart' });
    }

    user.cart.items.splice(cartItemIndex, 1);
    await user.save();
    res.send({ message: 'Product removed from cart' });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
});
cartRouter.get('/users/:userId/cart/total-price', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).populate('cart.items.productId');
    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    let totalPrice = 0;
    for (const item of user.cart.items) {
      const product = item.productId;
      const quantity = item.quantity;
      totalPrice += product.price * quantity;
    }

    res.send({ totalPrice });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
});
module.exports = cartRouter;
