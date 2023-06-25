const mongoose = require('mongoose');
const { productSchema } = require('./product');
const { cartItemSchema } = require('./cart');

authSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function (email) {
        const emailRegex = /^[\w.+-]+@gmail\.com$/i;
        return emailRegex.test(email);
      },
      message: (props) => `${props.value} is not a valid Gmail address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    default: 'user',
  },
  address: {
    type: String,
    default: '',
  },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
  userId: {
    type: String,
    default: () => {
      let result = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      for (let i = 0; i < 10; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    },
  },
  favorites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});
authSchema.pre('save', function (next) {
  const user = this;
  user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  next();
});

const User = mongoose.model('User', authSchema);
module.exports = User;
