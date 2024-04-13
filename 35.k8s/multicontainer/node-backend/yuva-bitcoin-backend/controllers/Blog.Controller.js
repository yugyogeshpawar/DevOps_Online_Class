const Blog = require('../models/Blog')
const Joi = require('joi');
const createBlog = async (req, res) => {
    // Define a schema for request body validation
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
    });
    try {
        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        // Check if the user making the request is an admin
        if (!req.user || req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Permission denied. Only admin can Create a Blog.' });
        }
        const { title, content } = value;
        const newBlog = new Blog({
            title, content,
            blogId: generateRandomString(), imageUrls: []
        });
        const savedBlog = await newBlog.save();
        res.status(201).json(savedBlog);
    } catch (error) {
        console.error('Error creating blog post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateBlogById = async (req, res) => {
    // Define a schema for request body validation
    const schema = Joi.object({
        title: Joi.string(),
        content: Joi.string(),
        // Add more fields as needed
    });
    try {
        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const blogId = req.params.blogId;
        const updatedProperties = value;

        // Check if the user making the request is an admin
        if (!req.user || req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Permission denied. Only admin can delete a blog.' });
        }

        // Find the blog by its ID
        const blog = await Blog.findOne({ blogId: blogId });

        if (!blog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        // Update the blog properties
        Object.assign(blog, updatedProperties);

        // Save the updated blog
        const updatedBlog = await blog.save();

        res.status(200).json(updatedBlog);
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// const getAllBlogs = async (req, res) => {
//     try {
//         const allBlogs = await Blog.find();
//         res.status(200).json(allBlogs);
//     } catch (error) {
//         console.error('Error fetching blog posts:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

const getAllBlogs = async (req, res) => {
    const schema = Joi.object({
        page_number: Joi.number(),
        count: Joi.number(),
    });

    const { error, value } = schema.validate(req.params);

    if (error) {
        return res.status(400).json({ status: false, error: error.details[0].message });
    }
    try {
        const page_number = value.page_number || 1;
        const count = value.count || 10;
        const offset = (page_number - 1) * count;

        // Fetch all stakes with sorting and pagination
        const blogs = await Blog.find()
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(count);
        // Total number of blogs
        const totalBlogs = await Blog.countDocuments();
        // If there are no stakes found, return an empty array
        if (!blogs || blogs.length === 0) {
            return res.status(404).json({
                status: false,
                message: "No stakes found",
                totalBlogs: totalBlogs,
                stakes: [],

            });
        }

        // Return the list of stakes
        return res.status(200).json({
            status: true,
            message: "Stakes found",
            totalBlogs: totalBlogs,
            blogs: blogs,
        });
    } catch (error) {
        console.error('Error fetching blog post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const deleteBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        // Validate the blogId parameter
        const schema = Joi.string().required();
        const { error } = schema.validate(blogId);

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        // if (!blogId) {
        //     return res.status(400).json({ error: 'Blog post ID is required' });
        // }

        // Check if the user making the request is an admin
        if (!req.user || req.user.userType !== 'admin') {
            return res.status(403).json({ error: 'Permission denied. Only admin can delete a blog.' });
        }


        const deletedBlog = await Blog.findOneAndDelete({ blogId: blogId });

        if (!deletedBlog) {
            return res.status(404).json({ message: 'Blog post not found' });
        }

        res.status(200).json({ message: 'Blog post deleted successfully', deletedBlog });
    } catch (error) {
        console.error('Error deleting blog post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

function generateRandomString() {
    const characters = '0123456789';
    const length = 6;

    let randomString = 'b';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

module.exports = {
    createBlog,
    getAllBlogs, updateBlogById, deleteBlogById
};
