const mongoose = require('mongoose');

const fragranceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['male', 'female', 'unisex'],
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
});

const Fragrance = mongoose.model('Product', fragranceSchema);

module.exports = Fragrance;
