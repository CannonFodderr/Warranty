const express = require('express'),
    mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: String,
    fullName: String,
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
        serial: String
    }]
});


module.exports = mongoose.model("User", userSchema);