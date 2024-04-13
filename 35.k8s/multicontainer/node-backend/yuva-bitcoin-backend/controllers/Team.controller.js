// const connection = require("../config/db.config");
// const  {promisify} = require("util");
// const query = promisify(connection.query).bind(connection);

// const MyReferral = async (req, res) => {
//     const member_user_id = req.user;
//     console.log(`member_user_id`, member_user_id);

//     const query1 = `SELECT * FROM tbl_memberreg WHERE sponcer_id='${member_user_id}'`;

//     try{
//         const output = await query(query1);
//         if(output.length === 0){
//             return res.status(400).send({
//                 status: false,
//                 message: "No team",
//             });
//         }
//         return res.status(200).send({
//             status: true,
//             message: "Team",
//             data: output,
//         });
//     }catch(err){
//         return res.status(500).send({
//             status: false,
//             message: "Internal Server Error",
//         });
//     }
// };

// const MyTeam = async (req, res) => {
//     const member_user_id = req.user;
//     console.log(`member_user_id`, member_user_id);

//     let i = 0;
//     let teamArray = [];
//     teamArray.push(member_user_id);
//     let level = 1;
//     let output = [];
    
//     while(i < teamArray.length){
//         let query1 = `SELECT * FROM tbl_memberreg WHERE sponcer_id='${teamArray[i]}'`;
//         console.log(`query1`, query1);
//         try{
//             let currOutput = await query(query1);
//             if(!currOutput){
//                 console.log("Empty");
//             }
//             else if(currOutput.length !== 0){
//                 console.log("Not Empty");
//                 console.log(currOutput.length);
//                 for(let j = 0; j < currOutput.length; j++){
//                     teamArray.push(currOutput[j].member_user_id);
//                     // console.log(`teamArray`, teamArray);
//                     console.log(currOutput[j]);
//                     currOutput[j].level = level;
//                     output.push(currOutput[j]);
//                     console.log(j);
//                 }
//                 level = level + 1;
//             }
//             i=i+1;
//         }catch(err){
//             return res.status(500).send({
//                 status: false,
//                 message: "Internal Server Error",
//             });
//         }
//     }

//     return res.status(200).send({
//         status: true,
//         message: "Team",
//         data: output,
//     });
// }

// module.exports = {
//     MyReferral,
//     MyTeam,
// };


const Member = require('../models/memberModel');

const MyReferral = async (req, res) => {
    const member_user_id = req.user;
    console.log(`member_user_id`, member_user_id);

    try {
        const output = await Member.find({ sponcer_id: member_user_id });
        if (output.length === 0) {
            return res.status(400).send({
                status: false,
                message: "No team",
            });
        }
        return res.status(200).send({
            status: true,
            message: "Team",
            data: output,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            status: false,
            message: "Internal Server Error",
        });
    }
};

const MyTeam = async (req, res) => {
    const member_user_id = req.user;
    console.log(`member_user_id`, member_user_id);

    let i = 0;
    let teamArray = [];
    teamArray.push(member_user_id);
    let level = 1;
    let output = [];

    while (i < teamArray.length) {
        try {
            const currOutput = await Member.find({ sponcer_id: teamArray[i] });
            if (currOutput.length !== 0) {
                for (let j = 0; j < currOutput.length; j++) {
                    teamArray.push(currOutput[j].member_user_id);
                    currOutput[j].level = level;
                    output.push(currOutput[j]);
                }
                level = level + 1;
            }
            i++;
        } catch (err) {
            console.error(err);
            return res.status(500).send({
                status: false,
                message: "Internal Server Error",
            });
        }
    }

    return res.status(200).send({
        status: true,
        message: "Team",
        data: output,
    });
}

module.exports = {
    MyReferral,
    MyTeam,
};

