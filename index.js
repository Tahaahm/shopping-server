const express = require('express');
const userRouter = require('./router/user');
const mongoose = require('mongoose');
const productRouter = require('./router/product');
const app = express();
const categoryRouter = require('./router/category');
const cartRouter = require('./router/cart');
const PORT = 3000;

app.use(express.json());

app.use(userRouter);
app.use(productRouter);
app.use(categoryRouter);
app.use(cartRouter);
// name of mongoose is :Shopping

//'mongodb+srv://tahaahmad837:taha123@cluster0.mhcaal1.mongodb.net/?retryWrites=true&w=majority'
const DB =
  'mongodb+srv://tahaahmad837:taha123@cluster0.mhcaal1.mongodb.net/?retryWrites=true&w=majority';
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });
app.listen(PORT, () => {
  console.log('Connected ');
});
