const express = require("express");
const router = express.Router();
const {
    createDeposit, getAllDepositsForAdmin, getDepositsForUser,convertDepositToCoins } = require("../controllers/deposit.controller");
const { ValidMember, isAdmin } = require('../middleware/Auth.middleware');

// router.route("/").get(getStakingData).post(ValidMember, stakingRequest);
router.route("/createDeposit").post(ValidMember, createDeposit);  //
router.route("/getDepositsForUser").get(ValidMember, getDepositsForUser);
router.route("/getAllDepositsForAdmin").get(isAdmin, getAllDepositsForAdmin);
router.route("/convertDepositToCoins").post(ValidMember, convertDepositToCoins); //

module.exports = router;
