const express = require("express");
const router = express.Router();
const { getAllCoins,setCoinPrices } = require("../controllers/Coin.Controller");
const { ValidMember, isAdmin } = require('../middleware/Auth.middleware');

// router.route("/").get(getStakingData).post(ValidMember, stakingRequest);
router.route("/getAllCoinsUser").get(ValidMember, getAllCoins);
router.route("/getAllCoinsAdmin").get(isAdmin, getAllCoins);
router.route("/setCoinPrices").post(isAdmin, setCoinPrices); //

module.exports = router;
