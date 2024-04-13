const express = require("express");
const router = express.Router();
const { ValidMember, isAdmin } = require('../middleware/Auth.middleware');

const { createSupport, adminReplyToUser, getAllSupport, getSupportForOneUser,getUserSupport } = require("../controllers/Support.Controller");


router.route('/createSupport').post(ValidMember, createSupport);
router.route('/adminReplyToUser/:supportTicketId').post(isAdmin, adminReplyToUser);
router.route('/getAllSupport/:page_number?/:count?').get(isAdmin, getAllSupport);
router.route('/getSupportForOneUser/:userId/:page_number?/:count?').get(isAdmin, getSupportForOneUser);
router.route('/getUserSupport/:page_number?/:count?').get(ValidMember, getUserSupport);
module.exports = router;
 