const mongoose = require('mongoose');

// Function to get the current date without the time component
function getCurrentDate() {
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to 0
  return currentDate;
}

const withdrawSchema = new mongoose.Schema({
  member_user_id: { type: String, required: true, ref: 'Member' },
  member_name: { type: String ,ref: 'Member', required: true},
  wallet_address: { type: String, required: true, ref: 'Member' },
  transection_hash: { type: String},
  with_amt: { type: Number, required: true },
  with_date: { type: Date, default: getCurrentDate },
  with_referrance: { type: String, required: true, unique: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  processing_date: { type: Date },
  processed_by: { type: String },
  remarks: { type: String },
  conversion_type: { type: String, enum: ['usdt', 'btc', 'ethereum'], ref:'Coin' },
  converted_amount: { type: Number },
});

const Withdraw = mongoose.model('Withdraw', withdrawSchema);

module.exports = Withdraw;
