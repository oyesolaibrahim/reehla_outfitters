const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    deliveryFee: {type: Number, required: true}
}, {timestamps: true});

const deliveryModel = mongoose.model("Delivery", deliverySchema);
module.exports = deliveryModel;