const express = require('express');
const userRouter = express.Router();
const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/auth');
userRouter.post('/api/create', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userEixts = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(password, 8);
    if (userEixts)
      return res
        .status(400)
        .json({ msg: 'User with the email is already exist' });

    let user = new User({
      name,
      email,
      password: hashedPassword,
    });

    user = await user.save();
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
userRouter.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ msg: 'User with the email is not exist' });

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, 'passwordKey');

    res.json({ token, ...user._doc });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

userRouter.post('/tokenIsValid', async (req, res) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.json(false);

    const verified = jwt.verify(token, 'passwordKey');
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    res.json(true);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
userRouter.get('/', auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({ ...user._doc, token: req.token });
});
module.exports = userRouter;
