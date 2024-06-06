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
  const removeBlog = (req, res) => {
    const { blogId } = req.query; 
    Blog.findByIdAndDelete(blogId)
        .then((blog) => {
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
            res.status(200).json({ message: "Blog deleted", blog });
        })
        .catch((error) => {
            res.status(500).json({ message: "Failed to delete brand", error });
        });
}

const deleteAllBlogs = (req, res) => {
    Blog.deleteMany()
        .then((blog) => {
            if (!blog) {
                return res.status(404).json({ message: "Blog not found" });
            }
            res.status(200).json({ message: "Blog deleted", blog });
        })
        .catch((error) => {
            res.status(500).json({ message: "Failed to delete brand", error });
        });
}

const editBlogPage = (req, res) => {
  const blogId = req.query.blogId
 Blog.findById({_id: blogId})
   .then((blog) => {
       res.status(200).json({message: "Edited", blog})
   })
   .catch(error => {
       res.status(404).json({message: "Failed to be Edited", error})
   })
}
const updateBlog = async (req, res) => {
  const { blogId } = req.query;
  const { subject, message } = req.body;
  let { imageUrl } = req.body;

  try {
      if (!blogId || !message ){
          return res.status(400).json({ message: "One or more required fields are missing" });
      }

      if (req.file) {
          imageUrl = await uploadFileToFirebase(req.file);
      }

      const blogData = { subject, imageUrl, message };
      await Blog.findByIdAndUpdate(blogId, blogData, { new: true });

      return res.status(200).json({ message: "Blog Updated Successfully" });
  } catch (error) {
      console.error("Error updating brand:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { 
  getAllBlogs,
  createBlogMessage,
  removeBlog,
  deleteAllBlogs,
  editBlogPage,
  updateBlog
 };
