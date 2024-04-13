const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  blogId: {
    type: String, // You can choose a different type based on your requirements (String, Number, etc.)
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrls: {
    type: [String]
  },
  //   author: {
  //     type: String,
  //     required: true,
  //   },
  //   dateCreated: {
  //     type: Date,
  //     default: Date.now,
  //   },
  //   tags: {
  //     type: [String],
  //     default: [],
  //   },
}, {
  timestamps: true,
});

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
