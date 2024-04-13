const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const memberSchema = new mongoose.Schema({
  member_user_id: { type: String, required: true, unique: true },
  contactNo: { type: String, required: true, unique: true },
  member_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registration_date: { type: Date, default: Date.now },
  wallet_address: { type: String, unique: true,required: true },
  coins: { type: Number, default: 0 },
  userType: { type: String, default: 'member' },
  twitterId: { type: String, unique: true, required: true },
  isActive: { type: Boolean, default: true },

  deposit_usdt: {
    type: Number,
    default: 0,
  },
  deposit_btc: {
    type: Number,
    default: 0,
  },
  deposit_ethereum: {
    type: Number,
    default: 0,
  },
  // isBlocked: { type: Boolean, default: false },

  lastDeletionDate: { type: Date }, // New field to store the date of the last deletion
  deletionCount: { type: Number, default: 0 }, // New field to store the count of deletions
},{
  timestamps: true});

// memberSchema.pre('save', async function(next) {
//   const member = this;
//   if (!member.isModified('password')) return next();
//   const salt = await bcrypt.genSalt(10);
//   member.password = await bcrypt.hash(member.password, salt);
//   next();
// });

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
