const   express                 = require('express'),
        mongoose                = require('mongoose'),
        passport                = require('passport'),
        passportLocalMongoose   = require('passport-local-mongoose');



let adminSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    permissions: {
        type: Number,
        default: 1
    }
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", adminSchema);