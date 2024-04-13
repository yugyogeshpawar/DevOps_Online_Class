const mongoose = require('mongoose');

const memberIncomeDetailsSchema = new mongoose.Schema({
    member_user_id: { type: String, required: true, ref: 'Member' },
    income_type: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

const MemberIncomeDetails = mongoose.model('MemberIncomeDetails', memberIncomeDetailsSchema);

module.exports = MemberIncomeDetails;
