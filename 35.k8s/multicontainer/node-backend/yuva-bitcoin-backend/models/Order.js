const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'Member'
    },
    coin: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    exchange_currency: {
        type: Number,
        required: true,
    },
    payment_method: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
    total: {
        type: Number,
        required: true,
    },
    transactionType: {
        type: String,
        required: true,
        enum: ['order_sell'],
    }
}, {
    timestamps: true
});

// Define methods for orderSchema
orderSchema.methods.calculateTotal = function () {
    return this.amount * this.exchange_currency;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;


// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//     userId: {
//         type: String,
//         required: true,
//         ref: 'Member'
//     },
//     coin: {
//         type: String,
//         // ref: "Coin", // Reference to the Coin model
//         required: true,
//     },
//     amount: {
//         type: Number,
//         required: true,
//         ref: "Deposit" // Reference to the Deposit model
//     },
//     exchange_currency: {
//         type: Number,
//         required: true,
//     },
//     payment_method: {
//         type: String,
//         required: true,
//     },
//     active: {
//         type: Boolean,
//         default: true,
//     },
//     total: {
//         type: Number, // Assuming the total is a numeric value
//         required: true,
//     },
//     transactionType: {
//         type: String,
//         required: true,
//         ref: "TransactionHistory"
//     }
// }, {
//     timestamps: true
// });

// // Define methods for orderSchema
// orderSchema.methods.calculateTotal = function () {
//     return this.amount * this.exchange_currency;
// };

// const Order = mongoose.model('Order', orderSchema);

// module.exports = Order;




const buyOrderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        ref: 'Member'
    },
    coin: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    purchasedCurrency: {
        type: String,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    transactionType: {
        type: String,
        required: true,
        enum: ['order_buy'], // Assuming 'order_buy' is the transaction type for buy orders
    },
    active: {
        type: Boolean,
        default: true,
    }
}, {
    timestamps: true
});

const BuyOrder = mongoose.model('BuyOrder', buyOrderSchema);

module.exports = {Order,BuyOrder};

