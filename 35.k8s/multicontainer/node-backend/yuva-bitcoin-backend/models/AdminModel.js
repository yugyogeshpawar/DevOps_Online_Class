// adminModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  admin_user_id: { type: String, required: true, unique: true },
  admin_name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registration_date: { type: Date, default: Date.now },
  userType: { type: String, default: 'admin' } ,
  yuva: { type: Number, default: 0 },
  usdt:{type: Number, default: 0},
});

adminSchema.pre('save', async function(next) {
  const admin = this;
  if (!admin.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  admin.password = await bcrypt.hash(admin.password, salt);
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
