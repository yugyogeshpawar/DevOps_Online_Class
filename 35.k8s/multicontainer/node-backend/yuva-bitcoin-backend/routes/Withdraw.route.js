const express = require("express");
const router = express.Router();
const { ValidMember, isAdmin } = require("../middleware/Auth.middleware");
const { withdrawRequest,getWithdrawByUserId,verifyOTP, getWithdrawRequests, updateWithdrawalStatus,getUserWithdraws,getWithdrawApproved,getWithdrawRejected,getWithdrawPending } = require("../controllers/Withdraw.controller");

router.route('/Request').post(ValidMember, withdrawRequest); //
router.route('/verifyOTP').post(ValidMember, verifyOTP); //
router.route('/updateWithdrawalStatus/:with_referrance').post(isAdmin, updateWithdrawalStatus);
router.route('/getWithdrawRequests/:page_number?/:count?').get(isAdmin, getWithdrawRequests);
router.route('/getWithdrawApproved/:page_number?/:count?').get(isAdmin, getWithdrawApproved);
router.route('/getWithdrawPending/:page_number?/:count?').get(isAdmin, getWithdrawPending);
router.route('/getWithdrawRejected/:page_number?/:count?').get(isAdmin, getWithdrawRejected);
router.route('/getUserWithdraws/:page_number?/:count?').get(ValidMember, getUserWithdraws);

  
router.route('/getWithdrawByUserId/:with_referrance').get(isAdmin, getWithdrawByUserId);

module.exports = router;

