const Category = require('../model/catgory');
const express = require('express');
const categoryRouter = express.Router();
categoryRouter.post('/admin/add-category', async (req, res) => {
  try {
    const { name } = req.body;

    let categorys = new Category({
      name,
    });
    categorys = await categorys.save();

    res.json(categorys);
  } catch (e) {
    res.status(500).json({ e: e.message });
  }
});
categoryRouter.post('/admin/get-category', async (req, res) => {
  try {
    const categories = await Category.find();
    const categoryNames = categories.map((category) => category.name);
    res.json(categoryNames);
  } catch (e) {
    res.status(500).json({ e: e.message });
  }
});
module.exports = categoryRouter;
