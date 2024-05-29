const mongoose = require("mongoose");

const topBrandsSchema = new mongoose.Schema({
    imageUrl: { type: String},
    brandName: { type: String, required: true },
    description: { type: String, required: true },
}, { timestamps: true });

const topBrandsModel = mongoose.model("topBrands", topBrandsSchema);
module.exports = topBrandsModel;
