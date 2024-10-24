const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: false },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true, unique: false },
    password: { type: String, required: true },
    securityAnswerOne: { type: String, required: true }, // First security answer
    securityAnswerTwo: { type: String, required: true }, // Second security answer
    // Array of orders, updated when new orders are made or deleted
    orderHistory: { type: [Number], default: [] } // Assuming an array of order IDs or similar
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
