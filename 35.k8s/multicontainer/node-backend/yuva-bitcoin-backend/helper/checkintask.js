const cron = require('node-cron');
const { AssignedTask } = require('../models/Task');

const doublechecktask = async () => {
    //write a code for checking if the task is completed and admin has confirmed
    const tasks = await AssignedTask.find({adminConfirmed: false});
    // console.log(tasks);
    tasks.forEach(element => {
       console.log(element.twitterId); 
    });


}

module.exports = doublechecktask
