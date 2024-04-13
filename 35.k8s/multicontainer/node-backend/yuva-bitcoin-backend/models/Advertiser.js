const mongoose = require('mongoose');
const Coin = require('./Coin'); // Import the Coin model
const Member = require('./memberModel');
const Deposit = require('./deposit');
// const advertiserSchema = new mongoose.Schema({
//     Advertiser_name: {
//         type: String,
//         required: true,
//         ref: 'Member',
//     },
//     userId: {
//         type: String,
//         required: true,
//         ref: 'Member',
//         unique: true
//     },
//     select_coin: {
//         type: String,
//         ref: "Coin", // Reference to the Coin model
//         required: true,
//     },
//     amount_currency: {
//         type: Number,
//         required: true,
//     },
//     select_currency: {
//         type: String,
//         required: true,
//     },
//     Available: {
//         type: Number,
//         required: true,
//     },
//     limit: {
//         type: Number,
//         required: true,
//     },
//     payment_method: {
//         type: [String],
//         required: true,
//     },
//     member_usdt: {
//         type: Number,
//         default: 0,
//     },
//     member_btc: {
//         type: Number,
//         default: 0,
//     },
//     member_ethereum: {
//         type: Number,
//         default: 0,
//     },
// }, {
//     timestamps: true,
// });

// Function to convert price to selected coin

//=====================================================================================================


const advertiserSchema = new mongoose.Schema({
    Advertiser_name: {
        type: String,
        required: true,
        ref: 'Member',
    },
    userId: {
        type: String,
        required: true,
        ref: 'Member',
        unique: true
    },
    select_coin: {
        type: String,
        ref: "Coin", // Reference to the Coin model
        required: true,
    },
    amount_currency: {
        type: Number,
        required: true,
        ref:"Deposit"
    },
    select_currency: {
        type: String,
        required: true,
    },
    // Available: {
    //     type: Number,
    //     required: true,
    // },
    // limit: {
    //     type: Number,
    //     required: true,
    // },
    payment_method: {
        type: [String],
        required: true,
    },
    member_usdt: {
        type: Number,
        default: 0,
    },
    member_btc: {
        type: Number,
        default: 0,
    },
    member_ethereum: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
advertiserSchema.methods.convertToCoin = async function () {
    const coin = await Coin.findOne({ name: this.select_coin });
    if (!coin) {
        throw new Error('Selected coin not found');
    }

    switch (this.select_coin) {
        case 'USDT':
            this.member_usdt = this.price / coin.usdtPrice;
            break;
        case 'BTC':
            this.member_btc = this.price / coin.btcPrice;
            break;
        case 'Ethereum':
            this.member_ethereum = this.price / coin.ethereumPrice;
            break;
        default:
            throw new Error('Invalid selected coin');
    }
};

const Advertiser = mongoose.model('Advertiser', advertiserSchema);

module.exports = Advertiser;
