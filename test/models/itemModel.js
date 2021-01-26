
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
    },
    subName: String,
    description: String,
    categoryLevel1: {
        required: true,
        type: String,
        enum: ["C.L. 1.1", "C.L. 1.2", "C.L. 1.3", "C.L. 1.4", "C.L. 1.5"]
    },
    categoryLevel2: {
        required: true,
        type: String,
        enum: ["C.L. 2.1", "C.L. 2.2", "C.L. 2.3", "C.L. 2.4", "C.L. 2.5"]
    },
    categoryLevel3: {
        required: true,
        type: String,
        enum: ["C.L. 3.1", "C.L. 3.2", "C.L. 3.3", "C.L. 3.4", "C.L. 3.5"]
    },
    upceanCode: Number,
    manufacturingCounry: String,
    brand: String,
    color: String,
    colorsAvailable: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }],
    productSizes: {
        width: Number,
        height: Number,
        depth: Number
    },
    categorySpecificFeature1: [Number],
    categorySpecificFeature2: String,
    categorySpecificFeature3: Number,
    pictures: [],
    currentPrice: {
        required: true,
        type: Number,
    },
    priceChangeHistory: [{
        date:  Date,
        price: Number
    }],
    discountCategory: {
        required: true,
        type: String,
        enum: ["none", "10%", "20%", "30%", "40%", "50%"],
        default: "none"
    },
    similarProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }],
    accessoryProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item"
    }]
});

const Item = mongoose.model("Item", itemSchema);

module.exports = { Item };