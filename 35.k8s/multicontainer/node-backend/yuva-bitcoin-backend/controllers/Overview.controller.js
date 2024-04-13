const Member = require("../models/memberModel");
const Stake = require("../models/stake");
const Deposit = require("../models/deposit");
const Admin = require("../models/AdminModel");
const { Task, CompletedTask } = require("../models/Task");

async function getOverview(req, res) {
  try {
    const allMembers = await Member.find();
    const activeMembers = await Member.find({ isActive: true });
    const inactiveMembers = await Member.find({ isActive: false });
    const allTasks = await Task.find();
    const allStakes = await Stake.find();
    const allCoin = await Member.find();
    const allDeposits = await Deposit.find();

    const adminData = await Admin.findOne()

    // Count completed tasks separately
    const completedTasksCount = await CompletedTask.countDocuments({ status: 'confirmed' });
    const pendingTasksCount = await CompletedTask.countDocuments({ status: 'pending' });

    // Count pending tasks separately
    // const pendingTasksCount = allTasks.length - completedTasksCount;

    const totalStakesInvestment = allStakes.reduce((total, stake) => total + stake.investment, 0);
    const totalMemberCoins = allCoin.reduce((total, member) => total + member.coins, 0);
    const totalDepositAmount = allDeposits.reduce((total, deposit) => total + deposit.amount, 0);

    console.log(adminData.yuva)
    return res.status(200).json({
      status: true,
      message: "Overview for admin panel",
      overview: {
        allMembers: allMembers.length,
        activeMembers: activeMembers.length,
        inactiveMembers: inactiveMembers.length,
        allTasks: allTasks.length,
        completedTasks: completedTasksCount,
        pendingTasks: pendingTasksCount,
        totalStakesInvestment,
        totalMemberCoins,
        totalDepositAmount,
        yuva: adminData.yuva,
        usdt: adminData.usdt
      },
    });
  } catch (error) {
    console.error("Error fetching overview data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}



async function getUserOverview(req, res) {
  try {
    const userId = req.user.member_user_id;

    // Retrieve data specific to the user
    const memberData = await Member.findOne({ member_user_id: userId });

    const completedTasksCount = await CompletedTask.countDocuments({ userId, status: 'confirmed' });
    const pendingTasksCount = await CompletedTask.countDocuments({ userId, status: 'pending' });

    // Count total tasks (tasks without status)
    const totalTasksCount = await Task.countDocuments();

    return res.status(200).json({
      status: true,
      message: "Overview for user",
      overview: {
        totalTasks: totalTasksCount,
        completedTasks: completedTasksCount,
        pendingTasks: pendingTasksCount,
        coins: memberData ? memberData.coins : 0,
        deposit_usdt: memberData ? memberData.deposit_usdt : 0,
      }
    });
  } catch (error) {
    console.error("Error fetching user overview data:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
}


module.exports = {
  getOverview, getUserOverview
}


// Count the tasks added by the user
// const userTasksCount = await Task.countDocuments({ userId });
// userTasks: userTasksCount,