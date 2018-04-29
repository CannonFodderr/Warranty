const   express = require('express'),
        mongoose = require('mongoose'),
        User = require('../models/user');
        passportLocalMongoose = require('passport-local-mongoose');


        const labSchema = new mongoose.Schema({
            customer: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            labNumber: String,
            date: {
                type: Date,
                default: Date.now()
            },
            product: String,
            content: String,
            notes: [{
                author: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Admin"
                },
                content: String,
                date: {
                    type: Date,
                    default: Date.now()
                }
            }],
            payment: String,
                isPayed: {
                    type: Boolean,
                    default: false
                },
        })

module.exports = mongoose.model("Lab", labSchema);