const express = require('express'),
    mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: String,
    fullName: String,
    phone: String,
    date: {
        type: Date,
        default: Date.now()
    },
    products: [{
        regDate: {
            type: Date,
            default: Date.now()
        },
        invoice: String,
        productName: String,
        serial: String,
        store: String
    }]
});


module.exports = mongoose.model("User", userSchema);