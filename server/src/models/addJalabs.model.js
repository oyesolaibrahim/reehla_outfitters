const mongoose = require('mongoose');

const jalabsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: String,
    enum: ['Male', 'Female', 'Children'],
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  oldPrice: {
    type: Number,
    required: true,
  },
});

const Jalabs = mongoose.model('Jalabs', jalabsSchema);

module.exports = Jalabs;
