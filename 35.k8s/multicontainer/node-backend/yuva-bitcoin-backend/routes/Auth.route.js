const express = require('express');
const router = express.Router();
const { ValidMember, isAdmin } = require("../middleware/Auth.middleware");
const { register, login, getRegister, adminRegister, adminLogin, verifyOTP, forgotPassword, verifyOTPForResetPassword, changePassword } = require('../controllers/Auth.controller');


// User LOGIN and Register
router.post('/register', register).get('/register', getRegister); //
router.post('/verifyOTP', verifyOTP);
router.post('/login', login);//

//Admin Login adn Register
router.post('/admin-register', adminRegister) //
router.post('/admin-login', adminLogin) //


router.post('/forgotPassword', forgotPassword);
router.post('/verifyOTPForResetPassword', verifyOTPForResetPassword);
router.post('/changePassword', ValidMember, changePassword);

module.exports = router;