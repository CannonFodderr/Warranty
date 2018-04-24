const   express                 = require('express'),
        mongoose                = require('mongoose'),
        passport                = require('passport'),
        passportLocalMongoose   = require('passport-local-mongoose');



let adminSchema = mongoose.Schema({
    username: String,
    password: String
});

adminSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Admin", adminSchema);