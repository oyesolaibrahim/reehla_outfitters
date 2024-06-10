const mongoose = require('mongoose');

const bestSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  brandName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Male', 'Female', 'Unisex'],
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
  oldPrice: {
    type: Number,
    required: true,
  },
});

const bestModel = mongoose.model("Best", bestSchema);
module.exports = bestModel;
