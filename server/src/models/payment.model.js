const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'bank_transfer'], required: true },
  reference: { type: String, required: true, unique: true },
  status: { type: String, enum: ['pending', 'success', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);
