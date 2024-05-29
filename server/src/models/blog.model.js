const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  imageUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blog', blogSchema);
