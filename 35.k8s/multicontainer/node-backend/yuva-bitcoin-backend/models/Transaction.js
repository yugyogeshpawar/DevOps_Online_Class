// Define TransactionHistory schema
const mongoose = require('mongoose');

const transactionHistorySchema = new mongoose.Schema({
    orderId: { type: String, ref: 'Order' },
    userId: { type: String, ref: 'Member' },
    adminId: { type: String, ref: 'Admin' },
    coin: { type: String, required: true },
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ['order_sell', 'order_buy'], required: true },
    createdAt: { type: Date, default: Date.now }
});
    
const TransactionHistory = mongoose.model('TransactionHistory', transactionHistorySchema);

module.exports = TransactionHistory;
