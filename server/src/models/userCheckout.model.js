const mongoose = require('mongoose');

const itemDetailsSchema = new mongoose.Schema({
  name: { type: String },
  category: { type: String },
  price: { type: Number },
  oldPrice: { type: Number },
  description: { type: String },
  imageUrl: { type: String },
}, { _id: false });

const cartDetailsSchema = new mongoose.Schema({
  pricePerQuantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  itemDetails: { 
    type: itemDetailsSchema,
    required: true 
  }
}, { _id: false });

const userCheckoutSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true }, 
  paymentOption: { type: String, required: true },
  sessionId: {
    type: String,
    validate: {
      validator: function(v) {
        return this.adminSessionId || v;
      },
      message: "Either sessionId or adminSessionId must be provided."
    },
    required: [function() { return !this.adminSessionId; }, 'sessionId is required if adminSessionId is not provided']
  },
  adminSessionId: {
    type: String,
    validate: {
      validator: function(v) {
        return this.sessionId || v;
      },
      message: "Either sessionId or adminSessionId must be provided."
    },
    required: [function() { return !this.sessionId; }, 'adminSessionId is required if sessionId is not provided']
  },
  quantity: { type: Number, required: true },
  subTotal: { type: Number, required: true },
  total: { type: Number, required: true },
  cartDetails: [cartDetailsSchema]
}, { timestamps: true });

const userCheckoutModel = mongoose.model('Clients', userCheckoutSchema);

module.exports = userCheckoutModel;
