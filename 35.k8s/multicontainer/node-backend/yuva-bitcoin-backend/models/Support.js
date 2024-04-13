const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    name: { type: String, required: true, ref: 'Member' },
    supportTicketId: { type: String, required: true, unique: true },
    twitterId: { type: String, required: true, ref: 'Member' },
    email: { type: String, required: true },
    userId: { type: String, required: true, ref: 'Member' },
    message: { type: String, required: true },
    replied: { type: Boolean, default: false },
});

const Support = mongoose.model('Support', supportSchema);



const replySchema = new mongoose.Schema({
    name: { type: String, required: true, ref: 'Support' },
    supportTicketId: { type: String, required: true, ref: 'Support' },
    twitterId: { type: String, required: true, ref: 'Support' },
    email: { type: String, required: true },
    userId: { type: String, required: true, ref: 'Support' },
    user_message: { type: String, required: true, ref: 'Support' },
    message: { type: String, required: true },
})

const Reply = mongoose.model('Reply', replySchema);
module.exports = { Support, Reply };
