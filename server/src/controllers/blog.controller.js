const Blog = require('../models/blog.model');

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Error fetching blogs' });
  }
};
const createBlogMessage = async (req, res) => {
    const { subject, message, imageUrl } = req.body;
  
    try {
      const newBlogMessage = new Blog({ subject, message, imageUrl });
      await newBlogMessage.save();
      res.status(201).json(newBlogMessage);
    } catch (error) {
      console.error('Error creating blog message:', error);
      res.status(500).json({ message: 'Error creating blog message' });
    }
  };

module.exports = { 
  getAllBlogs,
  createBlogMessage
 };
