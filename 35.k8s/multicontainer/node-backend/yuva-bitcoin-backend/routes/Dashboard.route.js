const express = require('express');
const router = express.Router();
const { getDashboardData, getAdminDashboardData } = require('../controllers/Dashboard.controller');
const {ValidMember, isAdmin} = require('../middleware/Auth.middleware');

router.route('/').get(ValidMember, getDashboardData);
router.route('/admin').get(isAdmin, getAdminDashboardData);

module.exports = router;
