const express = require("express");
const router = express.Router();
const {
    stakingSummary, transferToStaking, transferToWallet, stakingSummaryForAdmin, get3MonthsStake, get6MonthsStake,
    get12MonthsStake, getTotalInvestmentByUserId, get3MonthsUser, get6MonthsUser, get12MonthsUser, getStaked, getUnstaked, calculate } = require("../controllers/Staking.controller");
const { ValidMember, isAdmin } = require('../middleware/Auth.middleware');

// router.route("/").get(getStakingData).post(ValidMember, stakingRequest);
router.route("/Summary").get(ValidMember, stakingSummary);
router.route("/transferToStaking").post(ValidMember, transferToStaking); //
router.route("/transferToWallet").post(ValidMember, transferToWallet);  //

router.route("/getTotalInvestmentByUserId").get(ValidMember, getTotalInvestmentByUserId);
router.route("/get3MonthsStake").get(isAdmin, get3MonthsStake);
router.route("/get6MonthsStake").get(isAdmin, get6MonthsStake);
router.route("/get12MonthsStake").get(isAdmin, get12MonthsStake);

router.route("/get3MonthsUser").get(ValidMember, get3MonthsUser);
router.route("/get6MonthsUser").get(ValidMember, get6MonthsUser);
router.route("/get12MonthsUser").get(ValidMember, get12MonthsUser);


router.route("/SummaryForAdmin").get(isAdmin, stakingSummaryForAdmin);


router.route('/getStaked').get(ValidMember, getStaked);
router.route('/getUnstaked').get(ValidMember, getUnstaked);


router.route('/calculateInterest').post(calculate);

module.exports = router;
