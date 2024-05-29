const mongoose = require("mongoose");

const bestSellersSchema = new mongoose.Schema({
    productName: { type: String, required: true },
    imageUrl: { type: String},
    category: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, required: true },
}, { timestamps: true });

const bestSellersModel = mongoose.model("bestSellers", bestSellersSchema);
module.exports = bestSellersModel;
