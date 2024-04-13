const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Yuva Bit-Coin',
    unique: true,
  },
  price: {
    usdt: {
      type: Number,
      default: 0,
    },
    ethereum: {
      type: Number,
      default: 0,
    },
    btc: {
      type: Number,
      default: 0,
    }
  },
});

const Coin = mongoose.model('Coin', coinSchema);

module.exports = Coin;
