const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
