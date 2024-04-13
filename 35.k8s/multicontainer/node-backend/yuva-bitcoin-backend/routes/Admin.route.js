const express = require('express');
const router = express.Router();
const multer = require("multer");
const path = require('path');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: 'public/',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileExtension = path.extname(file.originalname);
        cb(null, uniqueSuffix + fileExtension);
    }
});



const upload = multer({ storage: storage });
const { getOverview, getUserOverview } = require('../controllers/Overview.controller');
const { getuserbalance, getAllStakes, getAllStake, addTask, editTask, getOneTaskforAdminConfirmationTask,getAllTasksforAdminWithoutStatus, updateMemberDetails, getMemberDetails, deleteTask, deleteManyTasks, getOneTask, deleteUser, getRejectedTasks, getAllTasks, completeTask, confirmTaskCompletion, getMemberByUserId, updateMemberStatus, getAllMembers, getActiveMembers, getBlockedMembers, getPendingTasks, getCompletedTasks, getConfirmedTasksForUser, getPendingTasksForUser, getRejectedTasksForUser, getAllTasksUser } = require('../controllers/AdminController');
const { ValidMember, isAdmin } = require('../middleware/Auth.middleware');

router.route('/addTask').post(isAdmin, upload.array('file', 10), addTask); //
router.route('/getAllTasksforAdminWithoutStatus/:page_number?/:count?').get(isAdmin, getAllTasksforAdminWithoutStatus);
router.route('/getAllTasksBoth/:page_number?/:count?').get(ValidMember, getAllTasks);
router.route('/getAllTasksUser/:page_number?/:count?').get(ValidMember, getAllTasksUser);
router.route('/getConfirmedTasksForUser/:page_number?/:count?').get(ValidMember, getConfirmedTasksForUser);
router.route('/getPendingTasksForUser/:page_number?/:count?').get(ValidMember, getPendingTasksForUser);
router.route('/getRejectedTasksForUser/:page_number?/:count?').get(ValidMember, getRejectedTasksForUser);
router.route('/getOneTask/:taskId').get(isAdmin, getOneTask);
// router.route('/getAllTasksAdmin').get(isAdmin, getAllTasks);
router.route('/editTask/:taskId').post(isAdmin, upload.array('file', 10), editTask); //
router.route('/deleteTask/:taskId').delete(isAdmin, deleteTask); //
router.route('/deleteManyTasks').delete(isAdmin, deleteManyTasks); //


router.route('/getOneTaskforAdminConfirmationTask/:taskId/:userId').get(isAdmin, getOneTaskforAdminConfirmationTask);  // pending task of users will show to admin
router.route('/getPendingTasks/:page_number?/:count?').get(isAdmin, getPendingTasks);  // pending task of users will show to admin
router.route('/getCompletedTasks/:page_number?/:count?').get(isAdmin, getCompletedTasks); // completed task of users will show to admin
router.route('/getRejectedTasks/:page_number?/:count?').get(isAdmin, getRejectedTasks); // rejected task of users will show to admin

router.route('/completeTask').post(ValidMember, completeTask); //
router.route('/confirmTaskCompletion').post(isAdmin, confirmTaskCompletion); //

router.route('/updateMemberStatus/:member_user_id').post(isAdmin, updateMemberStatus); //
router.route('/deleteUser/:member_user_id').delete(isAdmin, deleteUser); //

router.route('/getMemberDetails').get(ValidMember, getMemberDetails);
router.route('/updateMemberDetails').post(ValidMember, updateMemberDetails);

router.route('/getMemberByUserId/:member_user_id').get(isAdmin, getMemberByUserId);
router.route('/getAllMembers/:page_number?/:count?').get(isAdmin, getAllMembers);
router.route('/getActiveMembers/:page_number?/:count?').get(isAdmin, getActiveMembers);
router.route('/getBlockedMembers/:page_number?/:count?').get(isAdmin, getBlockedMembers);

router.route("/getAllStakes/:page_number?/:count?").get(isAdmin, getAllStakes);
router.route("/getAllStake/:page_number?/:count?").get(ValidMember, getAllStake);

router.route("/getOverview").get(isAdmin, getOverview);
router.route("/getUserOverview").get(ValidMember, getUserOverview);

router.route("/getuserbalance").get(ValidMember, getuserbalance);

module.exports = router;