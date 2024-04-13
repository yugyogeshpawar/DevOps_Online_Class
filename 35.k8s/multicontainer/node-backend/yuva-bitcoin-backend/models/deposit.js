const mongoose = require('mongoose');

// Define the schema for cash deposit
const depositSchema = new mongoose.Schema({
  member: {
    type: String, ref: 'Member',
    required: true
  },
  name: {
    type: String, ref: 'Member',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transaction_hash: {
    type: String,
    required: true,
    // unique: true,
  },
  wallet_address: {
    type: String,
    ref: 'Member',
    required: true
  },
  deposit_type: {
    type: String, enum: ['usdt', 'btc', 'ethereum'],
    required: true
  },
  sys_date: { type: Date, default: Date.now },


}, { timestamps: true });

// Create a model from the schema
const Deposit = mongoose.model('Deposit', depositSchema);

module.exports = Deposit;
