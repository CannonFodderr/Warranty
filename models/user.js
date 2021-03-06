const express = require('express'),
    mongoose = require('mongoose');

// Date format
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
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
        store: String,
        note: String,
        file: String
    }],
    labs:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lab"
    }]
});


module.exports = mongoose.model("User", userSchema);