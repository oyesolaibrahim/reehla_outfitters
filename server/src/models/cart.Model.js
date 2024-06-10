const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    pricePerQuantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
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
    itemDetails: { 
      type: {
        name: { type: String, required: true },
        brandName: { type: String },
        category: { type: String, required: true },
        price: { type: Number, required: true },
        oldPrice: { type: Number },
        size: { type: Number },
        description: { type: String, required: true },
        imageUrl: { type: String, required: true },
      },
      required: true 
    },
  }, { timestamps: true });
  
const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
