const express = require("express");
const router = express.Router();
const { ValidMember } = require("../middleware/Auth.middleware");
const { MyReferral, MyTeam } = require("../controllers/Team.controller");

router.route("/MyReferral").get(ValidMember, MyReferral);

router.route("/MyTeam").get(ValidMember, MyTeam);

module.exports = router;
