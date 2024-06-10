const mongoose = require('mongoose');

const arrivalSchema = new mongoose.Schema({
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

const arrivalModel = mongoose.model("Arrival", arrivalSchema);
module.exports = arrivalModel;
