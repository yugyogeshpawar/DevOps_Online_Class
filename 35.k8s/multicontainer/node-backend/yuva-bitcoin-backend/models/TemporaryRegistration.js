const mongoose = require('mongoose');

const TemporaryRegistrationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  registrationData: { type: Object, required: true },
  createdAt: { type: Date, expires: '5m', default: Date.now } // Expiry time of 5 minutes
}, { timestamps: true });

const TemporaryRegistration = mongoose.model('TemporaryRegistration', TemporaryRegistrationSchema);

module.exports = TemporaryRegistration;
