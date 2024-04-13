const mongoose = require('mongoose');

const TemporaryPasswordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
    default: () => Date.now() + 300000, // Set expiry to current time + 5 minutes (300,000 milliseconds)
  }
});

const TemporaryPasswordReset = mongoose.model('TemporaryPasswordReset', TemporaryPasswordResetSchema);

module.exports = TemporaryPasswordReset;
