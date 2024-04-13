// const connection = require("../config/db.config");
// const {promisify} = require("util");
// const query = promisify(connection.query).bind(connection);

// const stakingBonus = async (req, res) => {
//     const member_user_id = req.user;
//     let query1 = `SELECT * FROM tbl_member_income_dtails WHERE member_user_id='${member_user_id}' AND income_type='STAKING'`;
//     try{
//         const output = await query(query1);
//         if(output.length === 0){
//             return res.status(400).send({
//                 status: false,
//                 message: "No staking bonus",
//             });
//         }else{
//             return res.status(200).send({
//                 status: true,
//                 message: "Staking bonus",
//                 data: output,
//             });
//         }
//     }catch(err){
//         return res.status(500).send({
//             status: false,
//             message: "Internal Server Error",
//         });
//     }
// };

// const referralBonus = async (req, res) => {
//     const member_user_id = req.user;
//     let query1 = `SELECT * FROM tbl_member_income_dtails WHERE member_user_id='${member_user_id}' AND income_type='REFERRAL'`;
//     try{
//         const output = await query(query1);
//         if(output.length === 0){
//             return res.status(400).send({
//                 status: false,
//                 message: "No referral bonus",
//             });
//         }else{
//             return res.status(200).send({
//                 status: true,
//                 message: "Referral bonus",
//                 data: output,
//             });
//         }
//     }catch(err){
//         return res.status(500).send({
//             status: false,
//             message: "Internal Server Error",
//         });
//     }
// }

// module.exports = {
//     stakingBonus,
//     referralBonus,
// };



const MemberIncomeDetails = require("../models/memberIncomeDetails");

const stakingBonus = async (req, res) => {
    const member_user_id = req.user;

    console.log(member_user_id)
    try {
        const output = await MemberIncomeDetails.find({ member_user_id, income_type: 'STAKING' });
        if (output.length === 0) {
            return res.status(400).send({
                status: false,
                message: "No staking bonus",
            });
        } else {
            return res.status(200).send({
                status: true,
                message: "Staking bonus",
                data: output,
            });
        }
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Internal Server Error",
        });
    }
};

const referralBonus = async (req, res) => {
    const member_user_id = req.user;
    try {
        const output = await MemberIncomeDetails.find({ member_user_id, income_type: 'REFERRAL' });
        if (output.length === 0) {
            return res.status(400).send({
                status: false,
                message: "No referral bonus",
            });
        } else {
            return res.status(200).send({
                status: true,
                message: "Referral bonus",          
                data: output,
            });
        }
    } catch (err) {
        return res.status(500).send({
            status: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = {
    stakingBonus,
    referralBonus,
};
