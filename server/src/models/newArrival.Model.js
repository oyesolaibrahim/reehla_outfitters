const mongoose = require("mongoose");

const newArrivalSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    imageUrl: { type: String },
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    size: { type: Number, required: true },
    oldPrice: { type: Number, required: true },
}, { timestamps: true });

const newArrivalModel = mongoose.model("newArrival", newArrivalSchema);
module.exports = newArrivalModel;
