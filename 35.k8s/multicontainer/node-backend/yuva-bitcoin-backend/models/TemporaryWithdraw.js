const mongoose = require('mongoose');

const TemporaryWithdrawSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  withdrawData: { type: Object, required: true },
  createdAt: { type: Date, expires: '5m', default: Date.now } // Expiry time of 5 minutes
}, { timestamps: true });

const TemporaryWithdraw = mongoose.model('TemporaryWithdraw', TemporaryWithdrawSchema);

module.exports = TemporaryWithdraw;
