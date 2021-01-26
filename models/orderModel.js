const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    user: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    items: [{
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
        },
        quantity: Number,
        price: Number,            // <<< Not sure about security. Maybe we should parse
        priceReduction: Number   // <<<  the relevant price and discount from the Item DB...
    }],
    deliveryAddress: {
        country: {
            type: String,
            enum: ["Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany"],
            default: "Germany"
        },
        address1: String,
        address2: String,
        city: String,
        postcode: Number
    },
    status: {
        type: String,
        enum: ['basket','placed','sent','delivered','in-process','cancelled'],
        default: 'basket'
    },
    invoiceNumber: String,
    paymentStatus: {
        type: String,
        enum: ['unpaid','in-process','paid-in-full','partial-payment'],
        default: 'unpaid'   
    },
    paymentMethod: {}
});

const Order = mongoose.model("Order", orderSchema);

module.exports = { Order };