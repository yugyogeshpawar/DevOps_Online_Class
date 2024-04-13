const mongoose = require('mongoose');

// Define the schema for staking stake
const stakeHistorySchema = new mongoose.Schema({
  member_user_id: { type: String,required: true, ref: 'Stake' },
  member_name: { type: String, required: true, ref: 'Stake' },
  sys_date: { type: Date, default: Date.now, ref: 'Stake' },
  investment: { type: Number, required: true, ref: 'Stake' },
  transaction_id: { type: String, required: true, ref: 'Stake' },
  walletAddress: { type: String, ref: 'Stake'},
  stake_type: { type: String, enum: ['Wallet'], required: true, ref: 'Stake' },
  stakingDuration: { type: Number, required: true, ref: 'Stake' }, // Add staking duration field
  interestCredited: { type: Boolean, default: false, ref: 'Stake' },
  type:{type:String, enum:['staked','unstaked']},
});

// Create a model from the schema
const StakeHistory = mongoose.model('StakeHistory', stakeHistorySchema);

module.exports = StakeHistory;




