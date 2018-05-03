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
            check: {
                type: Number,
                default: 150
            },
            isPayed: {
                type: Boolean,
                default: false
            },
            cost: {
                type: Number,
                default: 0
            },
            status: {
                type: String,
                default: "פתוחה"
            },
            fixWarranty: Date
        })

module.exports = mongoose.model("Lab", labSchema);