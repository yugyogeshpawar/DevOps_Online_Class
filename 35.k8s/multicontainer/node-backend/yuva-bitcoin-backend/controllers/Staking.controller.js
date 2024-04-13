// const connection = require("../config/db.config");
// const { promisify } = require("util");
// const query = promisify(connection.query).bind(connection);

// const getStakingData = async (req, res) => {
//   const query1 = `SELECT * FROM tbl_adminChangeWallet where Status='0'`;
//   const output = await query(query1);
//   if (output.length === 0) {
//     return res.status(400).send({
//       message: "No wallet is currently available for staking",
//     });
//   } else {
//     const user = output[0];
//     return res.status(200).send({
//       message: "Wallet is available for staking",
//       wallet: user.walletAddress,
//     });
//   }
// };

// const stakingRequest = async (req, res) => {
//   const user = req.user;

//   //Get Member Name
//   const query1 = `SELECT * FROM tbl_memberreg WHERE member_user_id='${user}'`;
//   let output = await query(query1);
//   if (output.length === 0) {
//     return res.status(400).send({
//       message: "Invalid user id",
//     });
//   }
//   const member_name = output[0].member_name;

//   const currentDate = new Date();

//   const options = {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     timeZone: "Asia/Kolkata",
//   };

//   let sys_date = currentDate
//     .toLocaleString("en-IN", options)
//     .replace(",", "")
//     .replaceAll("/", "-");

//   const arr = sys_date.split("-");
//   sys_date = `${arr[2]}-${arr[1]}-${arr[0]}`;

//   const option = {
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//     timeZone: "Asia/Kolkata",
//   };

//   const time = currentDate.toLocaleString("en-IN", option);

//   sys_date = `${sys_date} ${time}`;

//   console.log(sys_date);

//   const { wallerAddress, amount, transactionHash } = req.body;
//   const query2 = `INSERT INTO tbl_stake (member_user_id , member_name , sys_date , investment , transaction_id , walletAddress, stake_type) VALUES ('${user}' , '${member_name}' , '${sys_date}' , '${amount}' , '${transactionHash}' , '${wallerAddress}'  , 'Wallet')`;

//   try {
//     const insertStake = await query(query2);
//   } catch (err) {
//     console.log(`error`, err);
//     return res.status(400).send({
//       message: "Error while inserting data",
//     });
//   }

//   return res.status(200).send({
//     message: "Staking request submitted successfully",
//   });
// };

// const stakingSummary = async (req, res) => {
//   const user = req.user;
//   const query1 = `SELECT * FROM tbl_stake WHERE member_user_id='${user}'`;
//   try {
//     const output = await query(query1);
//     return res.status(200).send({
//       message: "Staking summary",
//       data: output,
//     });
//   } catch (err) {
//     console.log(`error`, err);
//     return res.status(400).send({
//       message: "Error while fetching data",
//     });
//   }
// };

// module.exports = {
//   getStakingData,
//   stakingRequest,
//   stakingSummary,
// };


const Member = require('../models/memberModel');
const { v4: uuidv4 } = require('uuid');
const Stake = require("../models/stake");
const Joi = require('joi');
const StakeHistory = require('../models/stakingHistory');


const stakingSummaryForAdmin = async (req, res) => {
  try {
    const stakes = await Stake.find();
    return res.status(200).send({
      message: "Staking summary",
      data: stakes,
    });
  } catch (error) {
    console.error("Error retrieving staking summary:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};


const stakingSummary = async (req, res) => {
  const userId = req.user.member_user_id;

  try {
    const stakes = await Stake.find({ member_user_id: userId });
    return res.status(200).send({
      message: "Staking summary",
      data: stakes,
    });
  } catch (error) {
    console.error("Error retrieving staking summary:", error);
    return res.status(500).send({
      message: "Internal Server Error",
    });
  }
};


const getTotalInvestmentByUserId = async (req, res) => {
  const userId = req.user.member_user_id;
  try {
    const stakes = await Stake.find({ member_user_id: userId });
    let totalInvestment = 0;
    stakes.forEach(stake => {
      totalInvestment += stake.investment;
    });
    res.status(200).json({ userId: userId, totalInvestment: totalInvestment });
  } catch (error) {
    console.error("Error occurred while getting total investment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}


const get3MonthsStake = async (req, res) => {
  const userId = req.user.member_user_id;
  try {
    const stakes = await StakeHistory.find({ stakingDuration: 3 });


    res.status(200).json({ userId: userId, stakes: stakes });
  } catch (error) {
    console.error("Error occurred while getting Stake duration of 3 months", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const get6MonthsStake = async (req, res) => {
  const userId = req.user.member_user_id;
  try {
    const stakes = await StakeHistory.find({ stakingDuration: 6 });


    res.status(200).json({ userId: userId, stakes: stakes });
  } catch (error) {
    console.error("Error occurred while getting Stake duration of 6 months", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const get12MonthsStake = async (req, res) => {
  const userId = req.user.member_user_id;
  try {
    const stakes = await StakeHistory.find({ stakingDuration: 12 });


    res.status(200).json({ userId: userId, stakes: stakes });
  } catch (error) {
    console.error("Error occurred while getting Stake duration of 12 months", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//=========================================================================================================================

const get3MonthsUser = async (req, res) => {
  const userId = req.user.member_user_id;
  try {
    const stakes = await StakeHistory.find({ member_user_id: userId, stakingDuration: 3 });


    res.status(200).json({ stakes });
  } catch (error) {
    console.error("Error occurred while getting Stake duration of 3 months", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const get6MonthsUser = async (req, res) => {
  const userId = req.user.member_user_id;
  try {
    const stakes = await StakeHistory.find({ member_user_id: userId, stakingDuration: 6 });


    res.status(200).json({ stakes });
  } catch (error) {
    console.error("Error occurred while getting Stake duration of 6 months", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const get12MonthsUser = async (req, res) => {
  const userId = req.user.member_user_id;
  try {
    const stakes = await StakeHistory.find({ member_user_id: userId, stakingDuration: 12 });


    res.status(200).json({ stakes });
  } catch (error) {
    console.error("Error occurred while getting Stake duration of 12 months", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



function generateTransactionId() {
  return `${Date.now()}_${uuidv4()}`;
}


// working transferToStaking 
// async function transferToStaking(req, res) {

//   // Define a schema for request body validation
//   const schema = Joi.object({
//     investment: Joi.number().positive().required(),
//     stakingDuration: Joi.number().positive().required(),
//   });
//   try {
//     const userId = req.user.member_user_id;
//     // Validate the request body
//     const { error, value } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     const { investment, stakingDuration } = value;


//     // Check if the member exists
//     const member = await Member.findOne({ member_user_id: userId });
//     if (!member) {
//       return res.status(404).json({ error: 'Member not found' });
//     }

//     // Check if the member has sufficient balance in the wallet
//     if (member.coins < investment) {
//       return res.status(400).json({ error: 'Insufficient balance in the wallet' });
//     }

//     // Deduct the amount from the member's wallet
//     member.coins -= investment;
//     await member.save();

//     // Create a new Stake for the member
//     const newStake = new Stake({
//       member_user_id: member.member_user_id,
//       member_name: member.member_name,
//       investment,
//       transaction_id: generateTransactionId(),
//       stake_type: 'Wallet',
//       stakingDuration,
//     });

//     // Save the new Stake
//     const savedStake = await newStake.save();

//     res.status(200).json(savedStake);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

//====================================================================================


//testing staking
async function transferToStaking(req, res) {
  // Define a schema for request body validation
  const schema = Joi.object({
    investment: Joi.number().positive().required(),
    stakingDuration: Joi.number().positive().required(),
  });

  try {
    const userId = req.user.member_user_id;
    // Validate the request body
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { investment, stakingDuration } = value;

    // Check if the member exists
    const member = await Member.findOne({ member_user_id: userId });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    // Check if the member has sufficient balance in the wallet
    if (member.coins < investment) {
      return res.status(400).json({ error: 'Insufficient balance in the wallet' });
    }

    // Deduct the amount from the member's wallet
    member.coins -= investment;
    await member.save();

    // Create a new Stake for the member
    const newStake = new Stake({
      member_user_id: member.member_user_id,
      member_name: member.member_name,
      investment,
      transaction_id: generateTransactionId(), // assuming you have this function
      stake_type: 'Wallet',
      stakingDuration,
    });

    // Save the new Stake
    const savedStake = await newStake.save();

    // Save stake details to StakeHistory
    const newStakeHistory = new StakeHistory({
      member_user_id: member.member_user_id,
      member_name: member.member_name,
      investment,
      transaction_id: newStake.transaction_id,
      stake_type: 'Wallet',
      stakingDuration,
      type: 'staked', // Indicates the stake type
    });

    await newStakeHistory.save();

    res.status(200).json(savedStake);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
//testing wallet
async function transferToWallet(req, res) {
  try {
    const schema = Joi.object({
      amount: Joi.number().positive().required()
    });

    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const userId = req.user.member_user_id;
    const { amount } = value;

    const member = await Member.findOne({ member_user_id: userId });
    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    const stakings = await Stake.find({ member_user_id: userId, stake_type: 'Wallet' });

    // Check if any stake has interest not credited
    const hasUncreditedInterest = stakings.some(stake => !stake.interestCredited);
    if (hasUncreditedInterest) {
      return res.status(400).json({ error: 'Interest has not been credited for all stakes. Withdrawal not allowed.' });
    }

    let totalStackAmount = 0;
    for (const stake of stakings) {
      totalStackAmount += stake.investment;
    }


    if (totalStackAmount < amount) {
      return res.status(400).json({ error: 'Insufficient stack amount' });
    }

    let remainingAmount = amount;
    let totalWithdrawnAmount = 0;
    const deleteOperations = []; // Array to collect delete operations

    // Withdraw from existing stakes
    for (const stake of stakings) {
      if (remainingAmount <= 0) break;

      const withdrawnAmount = Math.min(stake.investment, remainingAmount);
      totalWithdrawnAmount += withdrawnAmount;

      stake.investment -= withdrawnAmount;
      remainingAmount -= withdrawnAmount;

      if (stake.investment <= 0) {
        // Collect delete operation for stake with zero investment
        deleteOperations.push(stake.deleteOne({ _id: stake._id }));
      } else {
        await stake.save();
      }
    }


    // Wait for all delete operations to complete
    await Promise.all(deleteOperations);

    // Save stake withdrawal details to StakeHistory
    const newStakeHistory = new StakeHistory({
      member_user_id: userId,
      member_name: member.member_name,
      investment: totalWithdrawnAmount,
      transaction_id: generateTransactionId(), // assuming you have this function
      stake_type: 'Wallet',
      stakingDuration: 0, // Set staking duration to 0 for withdrawal
      interestCredited: false, // Assuming no interest credited for withdrawal
      type: 'unstaked', // Indicates the withdrawal type
    });

    await newStakeHistory.save();


    // Update member's coins
    await Member.findOneAndUpdate(
      { member_user_id: userId },
      { $inc: { coins: totalWithdrawnAmount } }, // Increment coins by the withdrawn amount
    );

    res.status(200).json({ message: 'Withdrawal successful', withdrawnAmount: totalWithdrawnAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
//====================================================================================

// working transfer to wallet
// async function transferToWallet(req, res) {
//   try {
//     const schema = Joi.object({
//       amount: Joi.number().positive().required()
//     });

//     const { error, value } = schema.validate(req.body);

//     if (error) {
//       return res.status(400).json({ error: error.details[0].message });
//     }

//     const userId = req.user.member_user_id;
//     const { amount } = value;

//     const member = await Member.findOne({ member_user_id: userId });
//     if (!member) {
//       return res.status(404).json({ error: 'Member not found' });
//     }

//     const stakings = await Stake.find({ member_user_id: userId, stake_type: 'Wallet' });

//     let totalStackAmount = 0;
//     for (const stake of stakings) {
//       totalStackAmount += stake.investment;
//     }

//     if (totalStackAmount < amount) {
//       return res.status(400).json({ error: 'Insufficient stack amount' });
//     }

//     let remainingAmount = amount;
//     let totalWithdrawnAmount = 0;
//     const deleteOperations = []; // Array to collect delete operations

//     // Withdraw from existing stakes
//     for (const stake of stakings) {
//       if (remainingAmount <= 0) break;

//       const withdrawnAmount = Math.min(stake.investment, remainingAmount);
//       totalWithdrawnAmount += withdrawnAmount;

//       stake.investment -= withdrawnAmount;
//       remainingAmount -= withdrawnAmount;

//       if (stake.investment <= 0) {
//         // Collect delete operation for stake with zero investment
//         deleteOperations.push(stake.deleteOne({ _id: stake._id }));
//       } else {
//         await stake.save();
//       }
//     }

//     // Wait for all delete operations to complete
//     await Promise.all(deleteOperations);

//     // Update member's coins
//     await Member.findOneAndUpdate(
//       { member_user_id: userId },
//       { $inc: { coins: totalWithdrawnAmount } }, // Increment coins by the withdrawn amount
//     );

//     res.status(200).json({ message: 'Withdrawal successful', withdrawnAmount: totalWithdrawnAmount });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// }

const getStaked = async (req, res) => {
  try {
    const userId = req.user.member_user_id;
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    const staked = await StakeHistory.find({ member_user_id: userId, type: 'staked' });
    if (!staked) {
      return res.status(404).json({ message: 'Staked not found', staked: [] });
    }

    res.status(200).json({ message: 'staked found', staked });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error', error });
  }
}

const getUnstaked = async (req, res) => {
  try {
    const userId = req.user.member_user_id;
    if (!userId) {
      return res.status(404).json({ message: 'User not found' });
    }

    const staked = await StakeHistory.find({ member_user_id: userId, type: 'unstaked' });
    if (!staked) {
      return res.status(404).json({ message: 'Unstaked not found', staked: [] });
    }

    res.status(200).json({ message: 'unstaked found', staked });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error', error });
  }
}



// =================================CALCULATOR========================================================================================
function calculateInterest(amount, months) {
  let interestRate;
  if (months === 3) {
    interestRate = 0.05; // 5% per annum
  } else if (months === 6) {
    interestRate = 0.07; // 7% per annum
  } else if (months === 12) {
    interestRate = 0.10; // 10% per annum
  } else {
    return 'Invalid number of months';
  }

  const monthlyInterestRate = interestRate / 12;
  const totalInterest = amount * monthlyInterestRate * months;
  return totalInterest.toFixed(2); // return total interest rounded to 2 decimal places
}


const calculate = async (req, res) => {
  try {
    const { amount, months } = req.body;

    const totalInterest = parseFloat(calculateInterest(amount, months)); // Convert totalInterest to a number

    const total = amount + totalInterest;
    return res.status(200).json({ total });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal Server Error', error });
  }
}


module.exports = {
  stakingSummary,
  transferToStaking,
  transferToWallet,
  stakingSummaryForAdmin,
  getTotalInvestmentByUserId,
  get3MonthsStake,
  get6MonthsStake,
  get12MonthsStake,
  get3MonthsUser, get6MonthsUser, get12MonthsUser,

  getStaked, getUnstaked,

  calculate
};



