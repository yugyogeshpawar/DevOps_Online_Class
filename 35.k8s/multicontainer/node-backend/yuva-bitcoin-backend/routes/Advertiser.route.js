const express = require("express");
const router = express.Router();
const { createOrder, getAllOrders, getOneMembersOrders, getAllOrdersUser } = require("../controllers/Advertiser.Controller");
const { ValidMember, isAdmin } = require('../middleware/Auth.middleware');


router.route("/createOrder").post(ValidMember, createOrder); //
router.route("/getAllOrders").get(isAdmin, getAllOrders);
router.route("/getAllMemberOrders").get(getAllOrders);
router.route("/getOneMembersOrders/:member_user_id").get(isAdmin, getOneMembersOrders);
router.route("/getAllOrdersUser").get(ValidMember, getAllOrdersUser);

module.exports = router;
