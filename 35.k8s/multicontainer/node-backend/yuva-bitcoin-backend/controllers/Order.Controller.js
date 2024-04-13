const { Order, BuyOrder } = require('../models/Order');
const Member = require('../models/memberModel');
const Admin = require('../models/AdminModel');
const TransactionHistory = require('../models/Transaction');
// const BuyOrder = require('../models/Order');
const Joi = require('joi');




//=============================================================================================================================//
//================================================selling section==============================================================//   
const createOrder = async (req, res) => {
    try {
        const userId = req.user.member_user_id;
        const member = await Member.findOne({ member_user_id: userId });
        if (!member) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Extract data from request body
        const { coin, amount, exchange_currency } = req.body;

        // coin is not given
        if (!coin) {
            return res.status(400).json({ error: 'Coin is required' });
        }

        //amount 0 is not allowed
        if (amount === 0) {
            return res.status(400).json({ error: 'Amount cannot be 0' });
        }

        //if amount is negative
        if (amount < 0) {
            return res.status(400).json({ error: 'Amount cannot be negative' });
        }

        // Set payment method based on coin type
        let payment_method;
        if (coin === 'yuva') {
            payment_method = 'usdt';
        } else if (coin === 'usdt') {
            payment_method = 'yuva';
        } else {
            return res.status(400).json({ error: 'Invalid coin type' });
        }

        // Check if the member has sufficient balance of the specified coin
        let coinToDeductFrom;
        if (coin === 'yuva') {
            coinToDeductFrom = 'coins'; // Deduct from the general coins balance
        } else if (coin === 'usdt') {
            coinToDeductFrom = 'deposit_usdt'; // Deduct from the USDT deposit balance
        }
        // else {
        //     return res.status(400).json({ error: 'Invalid coin type' });
        // }

        if (member[coinToDeductFrom] < amount) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Create a new order instance
        const order = new Order({
            userId,
            coin,
            amount,
            exchange_currency,
            payment_method,
            transactionType: 'order_sell'
        });

        // Calculate total
        order.total = order.calculateTotal(); // Removed await since it's synchronous

        // Ensure total is not negative
        if (order.total < 0) {
            return res.status(400).json({ error: 'Total cannot be negative' });
        }

        // Round total to maximum 4 decimal digits
        order.total = Number(order.total.toFixed(4));


        // Deduct the amount from the member's balance
        member[coinToDeductFrom] -= amount;

        // Save the updated member object
        await member.save();

        // Find the admin record
        let admin = await Admin.findOne();

        // Ensure admin record exists
        if (!admin) {
            return res.status(400).json({ error: 'Admin not found' });
        }

        // Your existing logic for admin handling...
        // Check if the coin field exists in the admin document
        if (!admin[coin]) {
            // If the coin field does not exist, create it with the value of the deducted amount
            admin.set(coin, amount);
        } else {
            // If the coin field exists, add the deducted amount to its existing value
            admin.set(coin, admin[coin] + amount);
        }

        // Save the updated admin object
        await admin.save();

        // Save the order to the database
        await order.save();


        // Create a new TransactionHistory document for the order
        const transactionHistory = new TransactionHistory({
            orderId: order._id,
            userId: member.member_user_id,
            adminId: admin.admin_user_id,
            coin,
            amount,
            transactionType: 'order_sell' // This indicates it's a transaction related to an order
        });

        // Save the transaction history
        await transactionHistory.save();

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
};


const updateOrder = async (req, res) => {
    try {
        // Extract data from request body
        let { orderId, userId, coin, amount, exchange_currency, payment_method } = req.body;


        // if there is extra field in req.body give error
        const allowedFields = ['orderId', 'userId', 'coin', 'amount', 'exchange_currency', 'payment_method'];
        const extraFields = Object.keys(req.body).filter(key => !allowedFields.includes(key));
        if (extraFields.length > 0) {
            return res.status(400).json({ error: `Invalid fields: ${extraFields.join(', ')}` });
        }

        // Find the member by userId
        const member = await Member.findOne({ member_user_id: userId });
        if (!member) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Find the order by orderId
        let order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check if the order belongs to the member
        if (order.userId.toString() !== userId) {
            return res.status(400).json({ error: 'Order does not belong to the member' });
        }

        // coin and payment method can not be changed in an order
        if (coin !== order.coin || payment_method !== order.payment_method) {
            return res.status(400).json({ error: 'Coin and payment method cannot be changed in an order' });
        }

        //if coin is yuva then paymentmethod is usdt
        //if coin is usdt then paymentmethod is yuva
        if (coin === 'yuva') {
            payment_method = 'usdt';
        } else if (coin === 'usdt') {
            payment_method = 'yuva';
        }


        //amount can not be 0
        if (amount === 0) {
            return res.status(400).json({ error: 'Amount cannot be 0' });
        }

        // Calculate total of the updated order
        const newTotal = amount * exchange_currency;

        // Check if the member has sufficient balance for the updated order
        if (amount > member.coins) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Calculate the difference in amount compared to the previous order
        const amountDifference = amount - order.amount;

        // Update order fields
        order.userId = userId;
        order.coin = coin;
        order.amount = amount;
        order.exchange_currency = exchange_currency;
        order.payment_method = payment_method;
        // order.active = active;
        order.total = newTotal;
        // order.transactionType = transactionType;

        // Deduct the difference from member's coins
        member.coins -= amountDifference;

        // Save the updated member object
        await member.save();

        // Find the admin record (assuming there's an Admin model)
        let admin = await Admin.findOne();

        // Ensure admin record exists
        if (!admin) {
            return res.status(400).json({ error: 'Admin not found' });
        }

        // Check if the coin field exists in the admin document
        if (!admin[coin]) {
            // If the coin field does not exist, create it with the value of the deducted amount
            admin.set(coin, amountDifference);
        } else {
            // If the coin field exists, add the deducted amount to its existing value
            admin.set(coin, admin[coin] + amountDifference);
        }

        // Save the updated admin object
        await admin.save();

        // Save the updated order
        order = await order.save();

        res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Failed to update order' });
    }
};

const getAllOrder = async (req, res) => {
    const Schema = Joi.object({
        page_number: Joi.number(),
        count: Joi.number(),
    });

    const { error, value } = Schema.validate(req.params);

    if (error) {
        return res.status(400).json({ status: false, error: error.details[0].message });
    }

    try {
        const page_number = value.page_number || 1;
        const count = value.count || 10;
        const offset = (page_number - 1) * count;

        // Fetch total count of orders
        const totalOrders = await Order.countDocuments();

        // Fetch orders for the specified page with sorting and pagination
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(count);

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                status: false,
                message: "No order ",
                totalOrders: totalOrders,
                order: [],
            });
        }

        return res.status(200).json({
            status: true,
            message: "Orders Found",
            totalOrders: totalOrders,
            order: orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};


const getAllOrderForOneUSer = async (req, res) => {
    const Schema = Joi.object({
        page_number: Joi.number(),
        count: Joi.number(),
    });
    const { error, value } = Schema.validate(req.params);

    if (error) {
        return res.status(400).json({ status: false, error: error.details[0].message });
    }
    try {
        const userId = req.user.member_user_id;
        const page_number = value.page_number || 1;
        const count = value.count || 10;
        const offset = (page_number - 1) * count;

        const member = await Member.findOne({ member_user_id: userId });
        if (!member) {
            return res.status(400).json({ error: 'User not found' });
        }
        const toalOrders = await Order.find({ userId, transactionType: "order_sell" });
        // Fetch tasks for the user with sorting and pagination
        const order = await Order.find({ userId, transactionType: "order_sell" })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(count);
        // Find all orders
        // const orders = await Order.find({ userId, transactionType: "order_sell" });
        if (!order || order.length === 0) {
            return res.status(200).json({
                status: false,
                message: "No order ",
                toalOrders,
                order: [],
            });
        }

        return res.status(200).json({
            status: true,
            message: "Orders Found",
            totalOrders: toalOrders.length,
            order: order,

        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};


const getOrdersForAdminForOneUser = async (req, res) => {
    const Schema = Joi.object({
        userId: Joi.string().required(), // Expecting userId in the request params
        page_number: Joi.number(),
        count: Joi.number(),
    });
    const { error, value } = Schema.validate(req.params); // Corrected: req.params

    if (error) {
        return res.status(400).json({ status: false, error: error.details[0].message });
    }

    try {
        const { userId, page_number = 1, count = 10 } = value;
        const offset = (page_number - 1) * count;

        // Fetch total orders count for the user
        const totalOrders = await Order.find({ userId }).countDocuments();

        // Fetch orders for the user with sorting and pagination
        const orders = await Order.find({ userId })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(count);

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                status: false,
                message: "No orders found for the user",
                totalOrders: 0,
                orders: [],
            });
        }

        return res.status(200).json({
            status: true,
            message: "Orders found for the user",
            totalOrders,
            orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};

// const deleteOrder = async (req, res) => {
//     try {
//         // Extract data from request body
//         const { orderId, userId } = req.body;

//         // Find the order by orderId
//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ error: 'Order not found' });
//         }

//         // Check if the order belongs to the user
//         if (order.userId !== userId) {
//             return res.status(403).json({ error: 'You are not authorized to delete this order' });
//         }

//         // Find the member by userId
//         const member = await Member.findOne({ member_user_id: userId });
//         if (!member) {
//             return res.status(400).json({ error: 'User not found' });
//         }

//         // Add the order's amount back to the member's coins
//         member.coins += order.amount;

//         // Save the updated member object
//         await member.save();

//         // Find the admin record (assuming there's an Admin model)
//         let admin = await Admin.findOne();

//         // Ensure admin record exists
//         if (!admin) {
//             return res.status(400).json({ error: 'Admin not found' });
//         }

//         // Check if the coin field exists in the admin document
//         if (admin[order.coin]) {
//             // If the coin field exists, deduct the amount from its existing value
//             admin.set(order.coin, admin[order.coin] - order.amount);
//             // Save the updated admin object
//             await admin.save();
//         }

//         // Delete the order from the database
//         await Order.findByIdAndDelete(orderId);

//         res.status(200).json({ message: 'Order deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting order:', error);
//         res.status(500).json({ error: 'Failed to delete order' });
//     }
// };


//=======================================below is main deletion with restriction =============================================//
// const deleteOrder = async (req, res) => {
//     try {
//         // Extract data from request body
//         const { orderId, userId } = req.body;

//         // Find the order by orderId
//         const order = await Order.findById(orderId);
//         if (!order) {
//             return res.status(404).json({ error: 'Order not found' });
//         }

//         // Check if the order belongs to the user
//         if (order.userId !== userId) {
//             return res.status(403).json({ error: 'You are not authorized to delete this order' });
//         }

//         // Find the member by userId
//         const member = await Member.findOne({ member_user_id: userId });
//         if (!member) {
//             return res.status(400).json({ error: 'User not found' });
//         }

//         // Get the current date in YYYY-MM-DD format
//         const currentDate = new Date().toISOString().split('T')[0];

//         // Check if the current date is different from the last deletion date
//         if (member.lastDeletionDate && member.lastDeletionDate.toISOString().split('T')[0] !== currentDate) {
//             // If it's a new day, reset the deletion count and update the last deletion date
//             member.deletionCount = 0;
//             member.lastDeletionDate = new Date();
//         }

//         // Check if the user has exceeded the daily deletion limit (3 deletions per day)
//         if (member.deletionCount >= 3) {
//             return res.status(403).json({ error: 'You have reached the maximum daily deletion limit. Please try again tomorrow.' });
//         }

//         // Add the order's amount back to the member's coins
//         member.coins += order.amount;

//         // Increment the deletion count after successfully deleting an order
//         member.deletionCount++;

//         // Save the updated member object
//         await member.save();

//         // Find the admin record (assuming there's an Admin model)
//         let admin = await Admin.findOne();

//         // Ensure admin record exists
//         if (!admin) {
//             return res.status(400).json({ error: 'Admin not found' });
//         }

//         // Check if the coin field exists in the admin document
//         if (admin[order.coin]) {
//             // If the coin field exists, deduct the amount from its existing value
//             admin.set(order.coin, admin[order.coin] - order.amount);
//             // Save the updated admin object
//             await admin.save();
//         }

//         // Delete the order from the database
//         await Order.findByIdAndDelete(orderId);

//         res.status(200).json({ message: 'Order deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting order:', error);
//         res.status(500).json({ error: 'Failed to delete order' });
//     }
// };

const deleteOrder = async (req, res) => {
    try {
        // Extract data from request body
        const { orderId, userId } = req.body;

        // Find the order by orderId
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Find the member by userId
        const member = await Member.findOne({ member_user_id: userId });
        if (!member) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Get the current date
        const currentDate = new Date();
        // Get the last deletion date from the member's record
        const lastDeletionDate = member.lastDeletionDate || new Date(0); // If lastDeletionDate is not set, default to epoch

        // Compare dates to check if it's a new day
        if (!isSameDay(currentDate, lastDeletionDate)) {
            // If it's a new day, reset the deletion count and update the last deletion date
            member.deletionCount = 0;
            member.lastDeletionDate = currentDate;
        }

        // Check if the user has exceeded the daily deletion limit (3 deletions per day)
        if (member.deletionCount >= 3) {
            return res.status(403).json({ error: 'You have reached the maximum daily deletion limit. Please try again tomorrow.' });
        }

        // Increment the deletion count after successfully deleting an order
        member.deletionCount++;

        //add deleted amount return back to user coin and deposit_usdt according to the order's coin
        if (order.coin === 'yuva') {
            member.coins += order.amount;
        } else if (order.coin === 'usdt') {
            member.deposit_usdt += order.amount;
        }

        //amount has 4 decimal places
        member.deposit_usdt = parseFloat(member.deposit_usdt.toFixed(4));
        member.coins = parseFloat(member.coins.toFixed(4));

        // Save the updated member object
        await member.save();

        // Delete the order from the database
        await Order.findByIdAndDelete(orderId);

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
};

// Function to check if two dates are the same day
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}

module.exports = deleteOrder;




//===================================================================================================================================//

//==================================================Buying Orders=============================================================//

// const createBuyOrder = async (req, res) => {
//     try {
//         const buyerId = req.user.member_user_id;
//         const sellerId = req.body.sellerId; // Assuming the seller's ID is provided in the request body

//         // Fetch buyer and seller details
//         const buyer = await Member.findOne({ member_user_id: buyerId });
//         const seller = await Member.findOne({ member_user_id: sellerId });

//         // Check if buyer and seller exist
//         if (!buyer || !seller) {
//             console.log('Buyer or seller not found');
//             return res.status(404).json({ message: 'Buyer or seller not found' });
//         }

//         const orderId = req.params._id;

//         // Check if the order exists
//         const sellOrder = await Order.findById(orderId);

//         if (!sellOrder) {
//             return res.status(400).json({ error: 'Sell order not found' });
//         }

//         // Check if the sell order is active
//         if (!sellOrder.active) {
//             return res.status(400).json({ error: 'Sell order is not active' });
//         }

//         // Check if the coin of the buy order matches the coin of the sell order
//         if (sellOrder.coin !== req.body.coin) {
//             return res.status(400).json({ error: 'Coins of buy and sell orders do not match' });
//         }

//         // Check if the buyer has sufficient funds in their deposit_usdt balance
//         if (buyer.deposit_usdt < sellOrder.total) {
//             return res.status(400).json({ error: 'Insufficient funds in buyer\'s deposit_usdt balance' });
//         }

//         // Find the admin record
//         let admin = await Admin.findOne();
//         if (!admin) {
//             return res.status(400).json({ error: 'Admin not found' });
//         }

//         let deductionAmount = sellOrder.amount;

//         // Deduct the amount from the admin's balance based on the coin type
//         if (sellOrder.coin === 'yuva') {
//             if (admin.yuva < deductionAmount) {
//                 return res.status(400).json({ error: `Insufficient balance in admin's yuva wallet. Required: ${deductionAmount}, Available: ${admin.yuva}` });
//             }
//             admin.yuva -= deductionAmount;
//             // Add the deducted amount to the buyer's coins
//             buyer.coins += deductionAmount;
//         } else if (sellOrder.coin === 'usdt') {
//             if (admin.usdt < deductionAmount) {
//                 return res.status(400).json({ error: `Insufficient balance in admin's usdt wallet. Required: ${deductionAmount}, Available: ${admin.usdt}` });
//             }
//             admin.usdt -= deductionAmount;
//             // Add the deducted amount to the buyer's deposit_usdt balance
//             buyer.deposit_usdt += deductionAmount;
//         } else {
//             return res.status(400).json({ error: 'Invalid coin type' });
//         }

//         // Create a new buy order instance
//         const buyOrder = new BuyOrder({
//             userId: buyerId,
//             sellerId: sellerId,
//             coin: sellOrder.coin,
//             amount: sellOrder.amount,
//             purchasedCurrency: sellOrder.coin,
//             total: sellOrder.total,
//             transactionType: 'order_buy'
//         });

//         // Transfer the total amount from buyer to seller
//         buyer.deposit_usdt -= sellOrder.total;
//         seller.deposit_usdt += sellOrder.total;

//         await Promise.all([admin.save(), buyer.save(), seller.save(), buyOrder.save()]);

//         // Set the sellOrder as inactive
//         sellOrder.active = false;
//         await sellOrder.save();


//         // Create a new TransactionHistory document for the order
//         const transactionHistory = new TransactionHistory({
//             orderId: order._id,
//             userId: member.member_user_id,
//             adminId: admin.admin_user_id,
//             coin,
//             amount,
//             transactionType: 'order_buy' // This indicates it's a transaction related to an order
//         });

//         // Save the transaction history
//         await transactionHistory.save();

//         res.status(201).json({ message: 'Buy order created successfully', buyOrder });
//     } catch (error) {
//         console.error('Error creating buy order:', error);
//         res.status(500).json({ error: error.message }); // Send the error message back to the client
//     }
// };


// below is final createBuyOrder
// const createBuyOrder = async (req, res) => {
//     try {
//         const buyerId = req.user.member_user_id;
//         const sellerId = req.body.sellerId; // Assuming the seller's ID is provided in the request body

//         // Fetch buyer and seller details
//         const buyer = await Member.findOne({ member_user_id: buyerId });
//         const seller = await Member.findOne({ member_user_id: sellerId });

//         // Check if buyer and seller exist
//         if (!buyer || !seller) {
//             console.log('Buyer or seller not found');
//             return res.status(404).json({ message: 'Buyer or seller not found' });
//         }

//         const orderId = req.params._id;

//         // Check if the order exists
//         const sellOrder = await Order.findById(orderId);

//         if (!sellOrder) {
//             return res.status(400).json({ error: 'Sell order not found' });
//         }

//         // Check if the sell order is active
//         if (!sellOrder.active) {
//             return res.status(400).json({ error: 'Sell order is not active' });
//         }

//         // Check if the coin of the buy order matches the coin of the sell order
//         if (sellOrder.coin !== req.body.coin) {
//             return res.status(400).json({ error: 'Coins of buy and sell orders do not match' });
//         }

//         // Check if the buyer has sufficient funds in their deposit_usdt balance
//         if (buyer.deposit_usdt < sellOrder.total) {
//             return res.status(400).json({ error: 'Insufficient funds in buyer\'s deposit_usdt balance' });
//         }

//         // Find the admin record
//         let admin = await Admin.findOne();
//         if (!admin) {
//             return res.status(400).json({ error: 'Admin not found' });
//         }

//         let deductionAmount = sellOrder.amount;

//         // Deduct the amount from the admin's balance based on the coin type
//         if (sellOrder.coin === 'yuva') {
//             if (admin.yuva < deductionAmount) {
//                 return res.status(400).json({ error: `Insufficient balance in admin's yuva wallet. Required: ${deductionAmount}, Available: ${admin.yuva}` });
//             }
//             admin.yuva -= deductionAmount;
//             // Add the deducted amount to the buyer's coins
//             buyer.coins += deductionAmount;
//         } else if (sellOrder.coin === 'usdt') {
//             if (admin.usdt < deductionAmount) {
//                 return res.status(400).json({ error: `Insufficient balance in admin's usdt wallet. Required: ${deductionAmount}, Available: ${admin.usdt}` });
//             }
//             admin.usdt -= deductionAmount;
//             // Add the deducted amount to the buyer's deposit_usdt balance
//             buyer.deposit_usdt += deductionAmount;
//         } else {
//             return res.status(400).json({ error: 'Invalid coin type' });
//         }

//         // Create a new buy order instance
//         const buyOrder = new BuyOrder({
//             userId: buyerId,
//             sellerId: sellerId,
//             coin: sellOrder.coin,
//             amount: sellOrder.amount,
//             purchasedCurrency: sellOrder.coin,
//             total: sellOrder.total,
//             transactionType: 'order_buy'
//         });

//         // Transfer the total amount from buyer to seller
//         buyer.deposit_usdt -= sellOrder.total;
//         seller.deposit_usdt += sellOrder.total;

//         await Promise.all([admin.save(), buyer.save(), seller.save(), buyOrder.save()]);

//            // Create a new TransactionHistory document for the buyer order
//            const transactionHistoryBuyer = new TransactionHistory({
//             orderId: buyOrder._id, // Use buyOrder's _id
//             userId: buyer.member_user_id, // Assuming this is the correct field for the member's user id
//             adminId: admin.admin_user_id,
//             coin: sellOrder.coin,
//             amount: sellOrder.amount,
//             transactionType: 'order_buy' // This indicates it's a transaction related to a buy order
//         });

//         // Save the transaction history for the buyer order
//         await transactionHistoryBuyer.save();


//         // Set the sellOrder as inactive
//         sellOrder.active = false;
//         await sellOrder.save();

//         res.status(201).json({ message: 'Buy order created successfully', buyOrder });
//     } catch (error) {
//         console.error('Error creating buy order:', error);
//         res.status(500).json({ error: error.message }); // Send the error message back to the client
//     }
// };

// const createBuyOrder = async (req, res) => {
//     try {
//         const buyerId = req.user.member_user_id;
//         const sellerId = req.user.member_user_id; // Assuming the seller's ID is provided in the request body

//         // Fetch buyer and seller details
//         const buyer = await Member.findOne({ member_user_id: buyerId });
//         const seller = await Member.findOne({ member_user_id: sellerId });

//         // Check if buyer and seller exist
//         if (!buyer || !seller) {
//             console.log('Buyer or seller not found');
//             return res.status(404).json({ message: 'Buyer or seller not found' });
//         }

//         const orderId = req.params._id;

//         // Check if the order exists
//         const sellOrder = await Order.findById(orderId);

//         if (!sellOrder) {
//             return res.status(400).json({ error: 'Sell order not found' });
//         }

//         // Check if the sell order is active
//         if (!sellOrder.active) {
//             return res.status(400).json({ error: 'Sell order is not active' });
//         }

//         // Check if the coin of the buy order matches the coin of the sell order
//         if (sellOrder.coin !== req.body.coin) {
//             return res.status(400).json({ error: 'Coins of buy and sell orders do not match' });
//         }

//         // Check if the buyer has sufficient funds in their deposit_usdt balance
//         if (buyer.deposit_usdt < sellOrder.total) {
//             return res.status(400).json({ error: 'Insufficient funds in buyer\'s deposit_usdt balance' });
//         }

//         // Find the admin record
//         let admin = await Admin.findOne();
//         if (!admin) {
//             return res.status(400).json({ error: 'Admin not found' });
//         }


//         // Deduct the amount from the admin's balance based on the coin type
//         let deductionAmount = sellOrder.amount;
//         if (sellOrder.coin === 'yuva') {
//             // deductionAmount = sellOrder.amount * sellOrder.total; // Assuming amount is the price per unit
//             if (admin.yuva < deductionAmount) {
//                 return res.status(400).json({ error: `Insufficient balance in admin's yuva wallet. Required: ${deductionAmount}, Available: ${admin.yuva}` });
//             }
//             admin.yuva -= deductionAmount;
//         } else if (sellOrder.coin === 'usdt') {
//             if (admin.usdt < deductionAmount) {
//                 return res.status(400).json({ error: `Insufficient balance in admin's usdt wallet. Required: ${deductionAmount}, Available: ${admin.usdt}` });
//             }
//             admin.usdt -= deductionAmount;
//         } else {
//             return res.status(400).json({ error: 'Invalid coin type' });
//         }


//         await admin.save();

//         // Create a new buy order instance
//         const buyOrder = new BuyOrder({
//             userId: buyerId,
//             sellerId: sellerId,
//             coin: sellOrder.coin,
//             amount: sellOrder.amount,
//             purchasedCurrency: sellOrder.coin,
//             total: sellOrder.total,
//             transactionType: 'order_buy'
//         });

//         // Save the buy order to the database
//         await buyOrder.save();

//         // Set the sellOrder as inactive
//         sellOrder.active = false;
//         await sellOrder.save();

//         // Add the purchased amount to the seller's deposit_usdt balance
//         seller.deposit_usdt += sellOrder.total;
//         await seller.save();

//         res.status(201).json({ message: 'Buy order created successfully', buyOrder });
//     } catch (error) {
//         console.error('Error creating buy order:', error);
//         res.status(500).json({ error: error.message }); // Send the error message back to the client
//     }
// };


//second final
// const createBuyOrder = async (req, res) => {
//     try {
//         const buyerId = req.user.member_user_id;
//         const sellerId = req.body.sellerId; // Assuming the seller's ID is provided in the request body
//         const buyAmount = req.body.amount; // The amount the buyer wants to buy

//         // Fetch buyer and seller details
//         const buyer = await Member.findOne({ member_user_id: buyerId });
//         const seller = await Member.findOne({ member_user_id: sellerId });

//         // Check if buyer and seller exist
//         if (!buyer || !seller) {
//             console.log('Buyer or seller not found');
//             return res.status(404).json({ message: 'Buyer or seller not found' });
//         }

//         const orderId = req.params._id;

//         // Check if the order exists
//         const sellOrder = await Order.findById(orderId);

//         if (!sellOrder) {
//             return res.status(400).json({ error: 'Sell order not found' });
//         }

//         // Check if the sell order is active
//         if (!sellOrder.active) {
//             return res.status(400).json({ error: 'Sell order is not active' });
//         }

//         // Check if the coin of the buy order matches the coin of the sell order
//         if (sellOrder.coin !== req.body.coin) {
//             return res.status(400).json({ error: 'Coins of buy and sell orders do not match' });
//         }

//         // Calculate the total price based on the buy amount and sell price
//         const totalPrice = sellOrder.exchange_currency * buyAmount;

//         // Check if the buyer has sufficient funds in their deposit_usdt balance
//         if (buyer.deposit_usdt < totalPrice) {
//             return res.status(400).json({ error: 'Insufficient funds in buyer\'s deposit_usdt balance' });
//         }

//         // Find the admin record
//         let admin = await Admin.findOne();
//         if (!admin) {
//             return res.status(400).json({ error: 'Admin not found' });
//         }

//         // Deduct the amount from the admin's balance based on the coin type
//         let deductionAmount = buyAmount;

//         if (sellOrder.coin === 'yuva') {
//             if (admin.yuva < deductionAmount) {
//                 return res.status(400).json({ error: `Insufficient balance in admin's yuva wallet. Required: ${deductionAmount}, Available: ${admin.yuva}` });
//             }
//             admin.yuva -= deductionAmount;
//             // Add the deducted amount to the buyer's coins
//             buyer.coins += deductionAmount;
//         } else if (sellOrder.coin === 'usdt') {
//             if (admin.usdt < totalPrice) {
//                 return res.status(400).json({ error: `Insufficient balance in admin's usdt wallet. Required: ${totalPrice}, Available: ${admin.usdt}` });
//             }
//             admin.usdt -= totalPrice;
//             // Add the deducted amount to the buyer's deposit_usdt balance
//             buyer.deposit_usdt -= totalPrice;
//         } else {
//             return res.status(400).json({ error: 'Invalid coin type' });
//         }

//         // Create a new buy order instance
//         const buyOrder = new BuyOrder({
//             userId: buyerId,
//             sellerId: sellerId,
//             coin: sellOrder.coin,
//             amount: buyAmount,
//             purchasedCurrency: sellOrder.coin,
//             total: totalPrice,
//             transactionType: 'order_buy'
//         });

//         // Transfer the total amount from buyer to seller
//         seller.deposit_usdt += totalPrice;

//         await Promise.all([admin.save(), buyer.save(), seller.save(), buyOrder.save()]);

//         // Create a new TransactionHistory document for the buyer order
//         const transactionHistoryBuyer = new TransactionHistory({
//             orderId: buyOrder._id,
//             userId: buyer.member_user_id,
//             adminId: admin.admin_user_id,
//             coin: sellOrder.coin,
//             amount: totalPrice, // The total amount bought
//             transactionType: 'order_buy'
//         });

//         // Save the transaction history for the buyer order
//         await transactionHistoryBuyer.save();

//         // Set the sellOrder as inactive if the buy amount equals the sell amount
//         if (buyAmount === sellOrder.amount) {
//             sellOrder.active = false;
//             await sellOrder.save();
//         }

//         res.status(201).json({ message: 'Buy order created successfully', buyOrder });
//     } catch (error) {
//         console.error('Error creating buy order:', error);
//         res.status(500).json({ error: error.message }); // Send the error message back to the client
//     }
// };


const updateBuyOrder = async (req, res) => {
    try {
        const buyerId = req.user.member_user_id;
        const orderId = req.params._id;

        // Fetch buyer details
        const buyer = await Member.findOne({ member_user_id: buyerId });

        // Check if buyer exists
        if (!buyer) {
            return res.status(404).json({ message: 'Buyer not found' });
        }

        // Fetch the buy order
        let buyOrder = await BuyOrder.findById(orderId);
        if (!buyOrder) {
            return res.status(404).json({ message: 'Buy order not found' });
        }

        // Calculate the difference in amount compared to the previous order
        const amountDifference = req.body.amount - buyOrder.amount;

        // Check if the buyer has sufficient balance for the updated buy order
        if (req.body.amount > buyer.deposit_usdt) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        // Update buy order fields
        buyOrder.amount = req.body.amount;
        buyOrder.total = req.body.total;

        // Deduct the difference from buyer's deposit_usdt
        buyer.deposit_usdt -= amountDifference;

        // Save the updated buyer object
        await buyer.save();

        // Transfer the total amount from buyer to seller
        const seller = await Member.findOne({ member_user_id: buyOrder.sellerId });
        if (!seller) {
            return res.status(404).json({ message: 'Seller not found' });
        }

        seller.deposit_usdt += amountDifference;

        // Save the updated seller object
        await seller.save();

        // Save the updated buy order
        buyOrder = await buyOrder.save();

        res.status(200).json({ message: 'Buy order updated successfully', buyOrder });
    } catch (error) {
        console.error('Error updating buy order:', error);
        res.status(500).json({ error: 'Failed to update buy order' });
    }
};

const createBuyOrder = async (req, res) => {
    try {
        const buyerId = req.user.member_user_id;
        const sellerId = req.body.sellerId; // Assuming the seller's ID is provided in the request body
        const buyAmount = req.body.amount; // The amount the buyer wants to buy

        // Fetch buyer and seller details
        const buyer = await Member.findOne({ member_user_id: buyerId });
        const seller = await Member.findOne({ member_user_id: sellerId });

        // Check if buyer and seller exist
        if (!buyer || !seller) {
            console.log('Buyer or seller not found');
            return res.status(404).json({ message: 'Buyer or seller not found' });
        }

        const orderId = req.params._id;

        // Check if the order exists
        const sellOrder = await Order.findById(orderId);

        if (!sellOrder) {
            return res.status(400).json({ error: 'Sell order not found' });
        }

        // Check if the sell order is active
        if (!sellOrder.active) {
            return res.status(400).json({ error: 'Sell order is not active' });
        }

        // Check if the coin of the buy order matches the coin of the sell order
        if (sellOrder.coin !== req.body.coin) {
            return res.status(400).json({ error: 'Coins of buy and sell orders do not match' });
        }

        if (sellOrder.amount < buyAmount) {
            return res.status(400).json({ error: 'Buy amount exceeds sell amount' });
        }

        // Calculate the total price based on the buy amount and sell price
        const totalPrice = sellOrder.exchange_currency * buyAmount;

        // Check if the buyer has sufficient funds in their deposit_usdt balance
        if (buyer.deposit_usdt < totalPrice) {
            return res.status(400).json({ error: 'Insufficient funds in buyer\'s deposit_usdt balance' });
        }

        // Find the admin record
        let admin = await Admin.findOne();
        if (!admin) {
            return res.status(400).json({ error: 'Admin not found' });
        }

        // Deduct the amount from the admin's balance based on the coin type
        let deductionAmount = buyAmount;

        if (sellOrder.coin === 'yuva') {
            // Deduct the total price from the buyer's deposit_usdt balance
            buyer.deposit_usdt -= totalPrice;
            if (admin.yuva < deductionAmount) {
                return res.status(400).json({ error: `Insufficient balance in admin's yuva wallet. Required: ${deductionAmount}, Available: ${admin.yuva}` });
            }
            admin.yuva -= deductionAmount;
            // Add the deducted amount to the buyer's coins
            buyer.coins += deductionAmount;
        } else if (sellOrder.coin === 'usdt') {
            if (admin.usdt < totalPrice) {
                return res.status(400).json({ error: `Insufficient balance in admin's usdt wallet. Required: ${totalPrice}, Available: ${admin.usdt}` });
            }
            admin.usdt -= totalPrice;
            // Deduct the total price from the buyer's deposit_usdt balance
            buyer.deposit_usdt -= totalPrice;
            // Add the total price to the seller's deposit_usdt balance
            seller.deposit_usdt += totalPrice;
        } else {
            return res.status(400).json({ error: 'Invalid coin type' });
        }



        // Create a new buy order instance
        const buyOrder = new BuyOrder({
            userId: buyerId,
            sellerId: sellerId,
            coin: sellOrder.coin,
            amount: buyAmount,
            purchasedCurrency: sellOrder.coin,
            total: totalPrice,
            transactionType: 'order_buy'
        });

        // // Update the remaining amount and total in the orderSchema
        // sellOrder.amount -= buyAmount;
        // sellOrder.total -= totalPrice;

        // // Transfer the total amount from buyer to seller
        // seller.deposit_usdt += totalPrice;

        // await Promise.all([admin.save(), buyer.save(), seller.save(), buyOrder.save(), sellOrder.save()]);

        // // Create a new TransactionHistory document for the buyer order
        // const transactionHistoryBuyer = new TransactionHistory({
        //     orderId: buyOrder._id,
        //     userId: buyer.member_user_id,
        //     adminId: admin.admin_user_id,
        //     coin: sellOrder.coin,
        //     amount: totalPrice, // The total amount bought
        //     transactionType: 'order_buy'
        // });

        // // Save the transaction history for the buyer order
        // await transactionHistoryBuyer.save();

        // // Set the sellOrder as inactive if the buy amount equals the sell amount
        // if (sellOrder.amount === 0) {
        //     sellOrder.active = false;
        //     await sellOrder.save();
        // }

        // res.status(201).json({ message: 'Buy order created successfully', buyOrder });

        // Set the remaining amount and total in the orderSchema
        sellOrder.amount -= buyAmount;
        sellOrder.total -= totalPrice;

        // // Transfer the total amount from buyer to seller
        seller.deposit_usdt += totalPrice;

        // Set the sellOrder as inactive if the buy amount equals the sell amount
        if (sellOrder.amount === 0 && sellOrder.total === 0) {
            sellOrder.active = false;
        }

        await Promise.all([admin.save(), buyer.save(), seller.save(), buyOrder.save(), sellOrder.save()]);

        // Create a new TransactionHistory document for the buyer order
        const transactionHistoryBuyer = new TransactionHistory({
            orderId: buyOrder._id,
            userId: buyer.member_user_id,
            adminId: admin.admin_user_id,
            coin: sellOrder.coin,
            amount: totalPrice, // The total amount bought
            transactionType: 'order_buy'
        });

        // Save the transaction history for the buyer order
        await transactionHistoryBuyer.save();

        res.status(201).json({ message: 'Buy order created successfully', buyOrder });

    } catch (error) {
        console.error('Error creating buy order:', error);
        res.status(500).json({ error: error.message }); // Send the error message back to the client
    }
};


const getAllBuyOrder = async (req, res) => {
    const Schema = Joi.object({
        page_number: Joi.number(),
        count: Joi.number(),
    });

    const { error, value } = Schema.validate(req.params);

    if (error) {
        return res.status(400).json({ status: false, error: error.details[0].message });
    }

    try {
        const page_number = value.page_number || 1;
        const count = value.count || 10;
        const offset = (page_number - 1) * count;

        // Fetch total count of orders
        const totalBuyOrders = await BuyOrder.countDocuments();

        // Fetch orders for the specified page with sorting and pagination
        const orders = await BuyOrder.find()
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(count);

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                status: false,
                message: "No Buy order ",
                totalOrders: totalBuyOrders,
                order: [],
            });
        }

        return res.status(200).json({
            status: true,
            message: "Buy Orders Found",
            totalOrders: totalBuyOrders,
            order: orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};


const getAllBuyOrderForOneUSer = async (req, res) => {
    const Schema = Joi.object({
        page_number: Joi.number(),
        count: Joi.number(),
    });
    const { error, value } = Schema.validate(req.params);

    if (error) {
        return res.status(400).json({ status: false, error: error.details[0].message });
    }
    try {
        const userId = req.user.member_user_id;
        const page_number = value.page_number || 1;
        const count = value.count || 10;
        const offset = (page_number - 1) * count;

        const member = await Member.findOne({ member_user_id: userId });
        if (!member) {
            return res.status(400).json({ error: 'User not found' });
        }
        const toalBuyOrders = await BuyOrder.find({ userId, transactionType: "order_buy" });
        // Fetch tasks for the user with sorting and pagination
        const order = await BuyOrder.find({ userId, transactionType: "order_buy" })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(count);
        // Find all orders
        // const orders = await Order.find({ userId, transactionType: "order_sell" });
        if (!order || order.length === 0) {
            return res.status(200).json({
                status: false,
                message: "No Buy order ",
                toalBuyOrders: toalBuyOrders.length,
                order: [],
            });
        }

        return res.status(200).json({
            status: true,
            message: "Buy Orders Found",
            totalOrders: toalBuyOrders.length,
            order: order,

        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};


const getBuyOrdersForAdminForOneUser = async (req, res) => {
    const Schema = Joi.object({
        userId: Joi.string().required(), // Expecting userId in the request params
        page_number: Joi.number(),
        count: Joi.number(),
    });
    const { error, value } = Schema.validate(req.params); // Corrected: req.params

    if (error) {
        return res.status(400).json({ status: false, error: error.details[0].message });
    }

    try {
        const { userId, page_number = 1, count = 10 } = value;
        const offset = (page_number - 1) * count;

        // Fetch total orders count for the user
        const totalBuyOrders = await BuyOrder.find({ userId }).countDocuments();

        // Fetch orders for the user with sorting and pagination
        const orders = await BuyOrder.find({ userId })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(count);

        if (!orders || orders.length === 0) {
            return res.status(200).json({
                status: false,
                message: "No orders found for the user",
                totalBuyOrders: 0,
                orders: [],
            });
        }

        return res.status(200).json({
            status: true,
            message: "Orders found for the user",
            totalBuyOrders,
            orders: orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
};


module.exports = {
    createOrder, updateOrder, getAllOrder, getAllOrderForOneUSer, getOrdersForAdminForOneUser, deleteOrder, createBuyOrder, updateBuyOrder, getAllBuyOrder, getAllBuyOrderForOneUSer, getBuyOrdersForAdminForOneUser
};
