const express = require("express");
const router = express.Router();
const { ValidMember } = require("../middleware/Auth.middleware");
const {
  stakingBonus,
  referralBonus,
} = require("../controllers/Earning.controller");

router.route("/StakingBonus").get(ValidMember, stakingBonus);
router.route("/ReferralBonus").get(ValidMember, referralBonus);

module.exports = router;
