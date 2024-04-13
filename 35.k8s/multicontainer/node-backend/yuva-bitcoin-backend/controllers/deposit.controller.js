const Deposit = require('../models/deposit');
const Coin = require('../models/Coin');
const Member = require('../models/memberModel');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');


function generateTransactionId() {
  return uuidv4(); // Using just UUID for simplicity, feel free to customize it further
}

// async function createDeposit(req, res) {
//   // Define a schema for request body validation
//   const schema = Joi.object({
//     amount: Joi.number().positive().required(),
//     transaction_hash: Joi.string().required(),
//     wallet_address: Joi.string().required(),
//     deposit_type: Joi.string().valid('usdt', 'btc', 'ethereum').required(),
//   });
//   try {
//     const { error, value } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }
//     // Retrieve member information based on member_user_id
//     const { member_user_id, member_name, wallet_address } = req.user;
//     const member = await Member.findOne({ member_user_id, wallet_address });

//     if (!member) {
//       return res.status(404).json({ error: 'Member not found' });
//     }

//     // Check if the provided wallet_address matches the member's wallet_address
//     if (wallet_address !== value.wallet_address) {
//       return res.status(400).json({ error: 'Invalid wallet address' });
//     }

//     // Create a new deposit
//     const newDeposit = new Deposit({
//       member: member_user_id,
//       name: member_name,
//       amount: value.amount,
//       transaction_hash: value.transaction_hash,
//       // wallet_address: req.body.wallet_address,
//       wallet_address: wallet_address,
//       deposit_type: value.deposit_type,
//     });

//     // Update the total deposit for the specific deposit type in the Member schema
//     switch (req.body.deposit_type) {
//       case 'usdt':
//         member.deposit_usdt += value.amount;
//         break;
//       case 'btc':
//         member.deposit_btc += value.amount;
//         break;
//       case 'ethereum':
//         member.deposit_ethereum += value.amount;
//         break;
//       default:
//         return res.status(400).json({ error: 'Invalid deposit type' });
//     }

//     // Save the updated member object to the database
//     await member.save();

//     // Save the deposit to the database
//     const savedDeposit = await newDeposit.save();

//     res.status(201).json(savedDeposit);
//   } catch (error) {
//     console.error('Error creating deposit:', error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }
const createDeposit = async (req, res) => {
  try {
    // Define a schema for request body validation
    const schema = Joi.object({
      amount: Joi.number().positive().required(),
      transaction_hash: Joi.string().required(),
      wallet_address: Joi.string().required(),
      deposit_type: Joi.string().valid('usdt', 'btc', 'ethereum').required(),
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Retrieve member information based on member_user_id
    const { member_user_id, member_name, wallet_address } = req.user;
    const member = await Member.findOne({ member_user_id, wallet_address });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Check if the provided wallet_address matches the member's wallet_address
    if (wallet_address !== value.wallet_address) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    // Check if the transaction hash already exists
    const existingDeposit = await Deposit.findOne({ transaction_hash: value.transaction_hash });
    if (existingDeposit) {
      return res.status(400).json({ error: 'Transaction hash already exists' });
    }

    // check that amount has only 4 decimal in body
    const decimalCount = (value.amount.toString().split('.')[1] || '').length;
    if (decimalCount !== 4) {
      return res.status(400).json({ error: 'Amount should have only 4 decimal places' });
    }

    // while adding amount only 4 decimal is allowed
    value.amount = Number(value.amount.toFixed(4));


    // Create a new deposit
    const newDeposit = new Deposit({
      member: member_user_id,
      name: member_name,
      amount: value.amount,
      transaction_hash: value.transaction_hash,
      wallet_address: wallet_address,
      deposit_type: value.deposit_type,
    });

    // Update the total deposit for the specific deposit type in the Member schema
    switch (value.deposit_type) {
      case 'usdt':
        member.deposit_usdt += value.amount;
        break;
      case 'btc':
        member.deposit_btc += value.amount;
        break;
      case 'ethereum':
        member.deposit_ethereum += value.amount;
        break;
      default:
        return res.status(400).json({ error: 'Invalid deposit type' });
    }

    // deposit_usdthave 4 decimals
    member.deposit_usdt = Number(member.deposit_usdt.toFixed(4));

    // Save the updated member object to the database
    await member.save();

    // Save the deposit to the database
    const savedDeposit = await newDeposit.save();

    res.status(201).json(savedDeposit);
  } catch (error) {
    console.error('Error creating deposit:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};





async function getAllDepositsForAdmin(req, res) {
  try {
    // Retrieve all deposits
    const allDeposits = await Deposit.find();

    res.status(200).json(allDeposits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



async function getDepositsForUser(req, res) {
  const userId = req.user.member_user_id; // Assuming you're passing userId as a route parameter

  try {
    // Retrieve deposits for the specific user
    const userDeposits = await Deposit.find({ member: userId });
    console.log('User Deposits:', userDeposits);

    res.status(200).json(userDeposits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function convertDepositToCoins(req, res) {
  const schema = Joi.object({
    deposit_type: Joi.string().valid('usdt', 'btc', 'ethereum').required(),
    amount: Joi.number().positive().required(),
  });
  try {
    // Validate the request body
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    // Retrieve member information based on member_user_id
    const { member_user_id } = req.user;
    const member = await Member.findOne({ member_user_id });

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }
    const { deposit_type, amount } = value;
    // Check if the member has sufficient deposits to convert
    const depositAmount = member[`deposit_${deposit_type}`];


    if (depositAmount < amount) {
      return res.status(400).json({ error: 'Insufficient deposit amount' });
    }

    // Retrieve the current coin prices
    const coinPrices = await Coin.findOne(); // Assuming there's only one document for coin prices

    // Calculate the equivalent coin amount based on the deposit type
    let coinAmount;
    switch (req.body.deposit_type) {
      case 'usdt':
        coinAmount = req.body.amount / coinPrices.price.usdt;
        break;
      case 'btc':
        coinAmount = req.body.amount / coinPrices.price.btc;
        break;
      case 'ethereum':
        coinAmount = req.body.amount / coinPrices.price.ethereum;
        break;
    }

    // Update member's coins balance
    member.coins += coinAmount;

    // Update member's deposit balance (subtract the converted amount)
    member[`deposit_${req.body.deposit_type}`] -= req.body.amount;

    // Save the updated member object to the database
    await member.save();

    res.status(200).json({ message: 'Deposit converted to coins successfully', coinAmount, member });
  } catch (error) {
    console.error('Error converting deposit to coins:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



module.exports = {
  createDeposit, getAllDepositsForAdmin, getDepositsForUser, convertDepositToCoins
};




