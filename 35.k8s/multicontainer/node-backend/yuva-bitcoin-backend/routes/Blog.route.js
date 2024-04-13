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

const upload2 = multer({ storage: storage });
const { ValidMember, isAdmin } = require('../middleware/Auth.middleware');
const { createBlog, 
    // getAllBlogs, 
    getAllBlogs, updateBlogById, deleteBlogById } = require('../controllers/Blog.Controller');

router.route('/createBlog').post(isAdmin, upload2.array('file', 10), createBlog);  // 
router.route('/updateBlog/:blogId').post(isAdmin, upload2.array('file', 10), updateBlogById); //
router.route("/getAllBlogs/:page_number?/:count?").get(getAllBlogs);
router.route("/deleteBlog/:blogId").delete(isAdmin, deleteBlogById);



module.exports = router;