const { Support, Reply } = require('../models/Support');
const Member = require('../models/memberModel');
const nodemailer = require('nodemailer');
const Joi = require('joi')


// Function to generate a unique ticket ID starting with "#YB" and followed by 7 random numbers 
function generateTicketId() {
    const prefix = "YB";
    const randomNumber = Math.floor(1000000 + Math.random() * 9000000); // Generate random 7-digit number
    return `${prefix}${randomNumber}`;
}


const createSupport = async (req, res) => {
    try {
        const userId = req.user.member_user_id;
        const { name, twitterId, email, message } = req.body;

        // Check if user exists in the Member schema
        const member = await Member.findOne({ member_user_id: userId });

        if (!member) {
            return res.status(404).json({ error: 'User not found.' });
        }
        if (name && member.member_name !== name) {
            return res.status(400).json({ error: 'Name does not match.' });
        }
        // Check if the provided Twitter ID matches the user's Twitter ID
        if (twitterId && member.twitterId !== twitterId) {
            return res.status(400).json({ error: 'Provided Twitter ID does not match user\'s Twitter ID.' });
        }

        // Additional checks for other fields can be added here if needed
        // Generate support ticket ID
        const supportTicketId = generateTicketId();

        // Create support message
        const supportMessage = new Support({
            name: name, // Use the provided name
            supportTicketId: supportTicketId,
            twitterId: twitterId, // Use the provided Twitter ID
            email: email,
            userId: userId, // Use the user's ID from authentication
            message: message
        });

        // Save support message
        await supportMessage.save();


        // Send email to admin
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true, // Set to true for a secure connection
            auth: {
                user: 'support2@yuvabitcoin.com',
                pass: 'Support@123@YB'
            }
        });

        const mailOptions = {
            // from: email, // Use the user-provided email as sender
            // to: 'testing@yuvabitcoin.com',
            from: "support2@yuvabitcoin.com",
            to: "admin@yuvabitcoin.com",
            subject: 'New Support Message',
            text: `Name: ${name}\nTwitter ID: ${twitterId}\nEmail: ${email}\nMessage: ${message}`
        };

        console.log("from mail:", mailOptions.from)

        // Send email to admin
        await transporter.sendMail(mailOptions);


        return res.status(201).json({ message: 'Support message sent successfully.', supportMessage });
    } catch (error) {
        console.error('Error creating support message:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

// const createSupport = async (req, res) => {
//     try {
//         const userId = req.user.member_user_id;
//         const { name, twitterId, email, message } = req.body;
//         console.log(userId)
//         // Check if user exists in the Member schema
//         const member = await Member.findOne({ member_user_id: userId });

//         if (!member) {
//             return res.status(404).json({ error: 'User not found.' });
//         }
//         if (name && member.member_name !== name) {
//             return res.status(400).json({ error: 'Name does not match.' });
//         }
//         // Check if the provided Twitter ID matches the user's Twitter ID
//         if (twitterId && member.twitterId !== twitterId) {
//             return res.status(400).json({ error: 'Provided Twitter ID does not match user\'s Twitter ID.' });
//         }

//         // Additional checks for other fields can be added here if needed

//         // Create support message
//         const supportMessage = new Support({
//             name: name, // Use the provided name
//             twitterId: twitterId, // Use the provided Twitter ID
//             email: email,
//             userId: userId, // Use the user's ID from authentication
//             message: message
//         });

//         // Save support message
//         await supportMessage.save();

//         // Send email to admin
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: '191260107039setice@gmail.com',
//                 pass: 'pvvw lqvk axxs kwha'
//             }
//         });

//         const mailOptions = {
//             from: req.body.email,
//             to: '191260107039setice@gmail.com',
//             subject: 'New Support Message',
//             text: `Name: ${name}\nTwitter ID: ${twitterId}\nEmail: ${email}\nMessage: ${message}`
//         };
//         console.log(mailOptions.from)
//         // Send email to admin
//         await transporter.sendMail(mailOptions);

//         return res.status(201).json({ message: 'Support message sent successfully.', supportMessage });
//     } catch (error) {
//         console.error('Error creating support message:', error);
//         res.status(500).json({ error: 'Internal server error.' });
//     }
// };



// Function to reply to a support message
const adminReplyToUser = async (req, res) => {
    try {
        const { supportTicketId } = req.params;
        const { message } = req.body;

        // Fetch the latest support message from the user
        const latestMessage = await Support.findOne({ supportTicketId })
        // .sort({ createdAt: -1 });

        if (!latestMessage) {
            return res.status(404).json({ error: 'No message found for the user.' });
        }

        // Check if the user has already replied
        if (latestMessage.replied) {
            return res.status(400).json({ error: 'Your message has already been replied.' });
        }
        // Send reply email to the user
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true, // Set to true for a secure connection
            auth: {
                user: 'support2@yuvabitcoin.com',
                pass: 'Support@123@YB'
            }
        });

        const mailOptions = {
            from: 'support2@yuvabitcoin.com',
            to: latestMessage.email, // User's email
            subject: 'Reply to Your Support Message',
            text: message
        };

        // Send email to the user
        await transporter.sendMail(mailOptions);

        // Save admin reply in the Reply collection
        const reply = new Reply({
            name: latestMessage.name,
            twitterId: latestMessage.twitterId,
            supportTicketId: latestMessage.supportTicketId,
            email: latestMessage.email,
            userId: latestMessage.userId,
            user_message: latestMessage.message,
            message: message
        });
        await reply.save()

        // Update support message with admin reply
        latestMessage.adminReply = message;
        latestMessage.replied = true;
        await latestMessage.save();


        return res.status(200).json({ message: 'Reply sent successfully.' });
    } catch (error) {
        console.error('Error replying to user message:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};



const getAllSupport = async (req, res) => {
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

        const totalSupport = await Support.countDocuments();
        const supportMessages = await Support.find()
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(count);

        if (!supportMessages || supportMessages.length === 0) {
            return res.status(200).json({
                status: false, message: 'No support messages found', supportMessages: [], totalSupport
            });
        }
        res.status(200).json({ status: true, message: 'Support messages fetched successfully', totalSupport, supportMessages, supportMessages });
    } catch (error) {
        console.error('Error fetching support messages:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getSupportForOneUser = async (req, res) => {
    const Schema = Joi.object({
        page_number: Joi.number(),
        count: Joi.number(),
        userId: Joi.string().required(),
    });
    const { error, value } = Schema.validate(req.params);
    if (error) {
        return res.status(400).json({ status: false, error: error.details[0].message });
    }
    try {
        const { page_number, count, userId } = value;
        const pageNumber = page_number || 1;
        const itemCount = count || 10;
        const offset = (pageNumber - 1) * itemCount;

        const totalSupport = await Support.countDocuments({ userId });
        const supportMessages = await Support.find({ userId })
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(itemCount);

        if (!supportMessages || supportMessages.length === 0) {
            return res.status(200).json({
                status: false, message: 'No support messages found', supportMessages: [], totalSupport
            });
        }

        res.status(200).json({ status: true, message: 'Support messages fetched successfully', totalSupport, supportMessages });
    } catch (error) {
        console.error('Error fetching support messages:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
};

const getUserSupport = async (req, res) => {
    const Schema = Joi.object({
        page_number: Joi.number(),
        count: Joi.number(),
    });
    const { error, value } = Schema.validate(req.params);
    if (error) {
        return res.status(400).json({ status: false, error: error.details[0].message });
    }
    try {
        const { page_number, count } = value;
        const pageNumber = page_number || 1;
        const itemCount = count || 10;
        const offset = (pageNumber - 1) * itemCount;
        const userId = req.user.member_user_id;

        const totalSupport = await Support.countDocuments({ userId: userId });
        const supportMessages = await Support.find({ userId }).sort({ createdAt: -1 })
            .skip(offset)
            .limit(itemCount);
        if (!supportMessages || supportMessages.length === 0) {
            return res.status(200).json({
                status: false, message: 'No support messages found', supportMessages: [], totalSupport
            });
        }
        res.status(200).json({ status: true, message: 'Support messages fetched successfully', totalSupport, supportMessages });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    createSupport, adminReplyToUser, getAllSupport, getSupportForOneUser, getUserSupport
}