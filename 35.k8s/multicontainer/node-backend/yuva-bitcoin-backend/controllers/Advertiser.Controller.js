const Advertiser = require('../models/Advertiser');
const Coin = require('../models/Coin');
const Member = require('../models/memberModel');
const Deposit = require('../models/deposit');
// Create an order
// const createOrder = async (req, res) => {
//     const userId = req.user.member_user_id;
//     try {
//         const member = await Member.findOne({ member_user_id: userId });
//         if (!member) {
//             return res.status(400).json({ error: 'User not found' });
//         }

//         const {
//             // Advertiser_name,
//             select_coin,
//             amount_currency,
//             select_currency,
//             Available,
//             limit,
//             payment_method,
//         } = req.body;

//         // Find the selected coin in the Coin model
//         const coin = await Coin.findOne();

//         if (!coin) {
//             return res.status(400).json({ error: 'Selected coin not found' });
//         }

//         // Create a new advertiser
//         const newAdvertiser = new Advertiser({
//             userId: member.member_user_id,
//             Advertiser_name: member.member_name,
//             select_coin,
//             amount_currency,
//             select_currency,
//             Available,
//             limit,
//             payment_method,
//         });

//         // Convert amount to selected coin
//         switch (select_coin) {
//             case 'usdt':
//                 newAdvertiser.member_usdt = amount_currency / coin.price.usdt;
//                 break;
//             case 'btc':
//                 newAdvertiser.member_btc = amount_currency / coin.price.btc;
//                 break;
//             case 'ethereum':
//                 newAdvertiser.member_ethereum = amount_currency / coin.price.ethereum;
//                 break;
//             default:
//                 throw new Error('Invalid selected coin');
//         }

//         // Save the new advertiser
//         await newAdvertiser.save();

//         res.status(200).json(newAdvertiser);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };


const getAllOrders = async (req, res) => {
    try {
        // Retrieve advertisers from the database
        const advertisers = await Advertiser.find();

        // Check if there are no stakes found
        if (!advertisers || advertisers.length === 0) {
            return res.status(404).json({
                message: "No advertisers found",
            });
        }

        // Respond with the advertisers
        return res.status(200).json({
            message: "advertisers all order retrieved successfully",
            data: advertisers,
        });
    } catch (error) {
        console.error("Error retrieving advertisers:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

//for admin
const getOneMembersOrders = async (req, res) => {
    try {
        // Extract member_user_id from request parameters
        const { member_user_id } = req.params;

        // Fetch the member from the database based on member_user_id
        const member = await Member.findOne({ member_user_id: member_user_id });

        // If the member is not found, return a 404 response
        if (!member) {
            return res.status(404).json({
                status: false,
                message: `Member with user_id ${member_user_id} not found`,
                member: null,
            });
        }

        // Return the found member
        return res.status(200).json({
            status: true,
            message: `Member found with member_user_id ${member_user_id}`,
            member: member,
        });
    } catch (error) {
        console.error("Error fetching member:", error);
        return res.status(500).json({
            status: false,
            message: "Internal server error",
        });
    }
}

// for user
const getAllOrdersUser = async (req, res) => {
    try {
        const userId = req.user.member_user_id;
        const oneUserOrders = await Advertiser.find({ userId });
        res.json(oneUserOrders);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const Joi = require('joi')
const createOrder = async (req, res) => {
    const createOrderSchema = Joi.object({
        select_coin: Joi.string().valid('usdt', 'btc', 'ethereum').required(),
        amount_currency: Joi.number().positive().required(),
        select_currency: Joi.string().required(),
        payment_method: Joi.string().required(), // Update this line
      });
    const userId = req.user.member_user_id;
    try {
        const member = await Member.findOne({ member_user_id: userId });
        if (!member) {
            return res.status(400).json({ error: 'User not found' });
        }
          // Validate request body
    const { error, value } = createOrderSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

        const {
            // Advertiser_name,
            select_coin,
            amount_currency,
            select_currency,
            // Available,
            // limit,
            payment_method,
        } = value;

        // Find the selected coin in the Coin model
        const coin = await Coin.findOne();

        if (!coin) {
            return res.status(400).json({ error: 'Selected coin not found' });
        }

        const amount = await  Deposit.findOne();
        if (!amount) {
            return res.status(400).json({ error: 'Insufficient Balance' });
        }
        // Create a new advertiser
        const newAdvertiser = new Advertiser({
            userId: member.member_user_id,
            Advertiser_name: member.member_name,
            select_coin,
            amount_currency,
            select_currency,
            // Available,
            // limit,
            payment_method,
        });

        // Convert amount to selected coin
        switch (select_coin) {
            case 'usdt':
                newAdvertiser.member_usdt = amount_currency / coin.price.usdt;
                break;
            case 'btc':
                newAdvertiser.member_btc = amount_currency / coin.price.btc;
                break;
            case 'ethereum':
                newAdvertiser.member_ethereum = amount_currency / coin.price.ethereum;
                break;
            default:
                throw new Error('Invalid selected coin');
        }

        // Save the new advertiser
        await newAdvertiser.save();

        res.status(200).json(newAdvertiser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


module.exports = {
    createOrder, getAllOrders, getOneMembersOrders, getAllOrdersUser
};
