const Member = require("../models/memberModel");
const Admin = require("../models/AdminModel");

const getDashboardData = async (req, res) => {
  const {member_user_id} = req.user;

  console.log(member_user_id);

  try {
    const user = await Member.findOne({member_user_id: member_user_id});

    if (!user) {
      return res.status(400).send({
        status: false,
        message: "Invalid user id",
      });
    }

    const returnObject = {
      member_user_id: member_user_id,
      coin: user.coin,
      member_name: user.member_name,
      sponcer_id: user.sponcer_id,
      sponcer_name: user.sponcer_name,
      wallet_address: user.wallet_address,
      promoter_id: user.promoter_id,
      promoter_name: user.promoter_name,
      contact: user.contactNo,
      email: user.email,
      status: user.status,
      registration_date: user.registration_date,
      member_status: user.member_status,
      kyc_status: user.kyc_status,
      topup_amount: user.topup_amount,
      direct_member: user.direct_member,
      wallet_amount: user.wallet_amount,
      checked: user.checked,
      withdrawal_amt: user.withdrawal_amt,
      block_status: user.block_status,
      current_investment: user.current_investment,
      direct_business: user.direct_business,
      total_earning: user.total_earning,
      isblock: user.isblock,
      team_business: user.team_business,
      expiry_date: user.expiry_date,
      expiry_date2: user.expiry_date2,
      team_member: user.team_member,
      activation_date: user.activation_date,
      profile_image: user.profile_image,
      front_image: user.front_image,
      back_image: user.back_image,
      member_dob: user.member_dob,
      address: user.address,
      pincod: user.pincod,
      gender: user.gender,
      country_code: user.country_code,
      state: user.state,
      city: user.city,
      calTeamStatus: user.calTeamStatus,
      updateWallet: user.updateWallet,
    };

    return res.status(200).send({
      status: true,
      message: "Dashboard data",
      data: returnObject,
    });
  } catch (error) {
    console.log("Error fetching dashboard data:", error);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};

const getAdminDashboardData = async (req, res) => {
  const {admin_user_id} = req.user; 

  try {
    const admin = await Admin.findOne({admin_user_id: admin_user_id });

    if (!admin) {
      return res.status(400).send({
        status: false,
        message: "Invalid admin user id",
      });
    }

    const returnObject = {
      admin_user_id: admin.admin_user_id,
      admin_name: admin.admin_name,
      password: admin.password,
      email: admin.email,
      registration_date: admin.registration_date,
      userType: admin.userType,
    };

    return res.status(200).send({
      status: true,
      message: "Admin dashboard data",
      data: returnObject,
    });
  } catch (error) {
    console.log("Error fetching admin dashboard data:", error);
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = {
  getDashboardData,
  getAdminDashboardData,
};
