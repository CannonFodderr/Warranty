const   express     = require('express'),
        router      = express.Router(),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        request     = require('request'),
        middleware  = require('../middleware'),
        permissions = require('../middleware/permissions'),
        expressSanitizer = require('express-sanitizer'),
        captchaKey  = process.env.CAPTCHA,
        Admin       = require('../models/admin'),
        User        = require('../models/user'),
        Lab         = require('../models/lab');

const middlewareOBJ = {};

// ====================
// ROUTER MIDDLEWARE
// ====================
middlewareOBJ.formIsFilled = (req, res, next) => {
    if( req.body.user.fullName < 4 || 
        req.body.user.invoice < 6 ||
        req.body.user.productName < 4 ||
        req.body.user.serial < 8 ) {
            res.render('index', {msg: "Incorrect Details"});

        } else {
            next();
        }
}
// check if admin is logged in
middlewareOBJ.isAdmin = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

middlewareOBJ.checkAdminPermissions = (req, res, next) => {
    if(req.isAuthenticated() && req.user.permissions >= permissions.permissions.Admin){
        return next();
    } else {
        res.render('login', {msg: "אין לך הרשאות מתאימות"});
    }
}
// ====================
// INDEX MIDDLEWARE
// ====================
// New Register form
middlewareOBJ.newRegisterForm = (req, res) => {
    let sanitizedName = req.sanitize(req.body.user.fullName);
    let sanitizeProductName = req.sanitize(req.body.user.productName);
    let sanitizeEmail = req.sanitize(req.body.user.email);
    let sanitizedNote = req.sanitize(req.body.user.note);
    let sanitizeSerial = req.sanitize(req.body.user.serial);
    let newUser = {
        email: sanitizeEmail,
        fullName: sanitizedName,
        phone: req.body.user.phone
    }
    let newProduct = {
        invoice: req.body.user.invoice,
        productName: sanitizeProductName,
        serial: sanitizeSerial,
        store: req.body.store,
        note: sanitizedNote
    }
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null) {
        return res.render('index', {msg: "Please select captcha"});
    }
    var verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" + captchaKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
    request(verificationUrl,function(error,response,body) {
        body = JSON.parse(body);
        // Success will be true or false depending upon captcha validation.
        if(body.success !== undefined && !body.success) {
          return res.json({"responseCode" : 1,"responseDesc" : "Failed captcha verification"});
        }
        let query = User.where({email: newUser.email});
        query.findOne((err, foundEmail) => {
        if(err){
            console.log(err);
            res.redirect('/');
        } else if(foundEmail == null){
            console.log('Email is null creating new User')
            User.create(newUser, (err, createdUser) => {
                if(err){ 
                    console.log(err);
                    res.render('index', {msg: "תקלה בשליחת הטופס אנא נסה שנית"});
                } else {
                    createdUser.products.push(newProduct);
                    createdUser.save();
                    res.render('index', {msg: "תודה, הטופס נשלח בהצלחה"});
                }
            })
        } else {
            console.log('Found Email adding to products array');
            foundEmail.products.push(newProduct);
            foundEmail.save();
            res.render('index', {msg: "תודה, הטופס נשלח בהצלחה"});
        }
    });
    });
}

// ====================
// LAB MIDDLEWARE
// ====================
// New lab form
middlewareOBJ.createNewLab = (req, res, isPayed, userData) => {
    User.findOne({email: req.body.user.email})
    .then((user)=>{
        let note = {
            author: req.user._id,
            content: req.body.lab.note
        };
        if(user == null){
            // User is null
            User.create(userData, (err, createdUser) => {
                if(err) throw err;
                let newForm = {
                    labNumber:  req.body.lab.number,
                    product: req.body.lab.product,
                    content: req.body.lab.content,
                    payment: req.body.lab.check,
                    status: req.body.lab.status,
                    customer: createdUser._id,
                    isPayed: isPayed
                }
                Lab.create(newForm, (err, createdForm)=>{
                    if(err) throw err;
                    createdUser.labs.push(createdForm._id);
                    createdUser.save();
                    createdForm.notes.push(note);
                    createdForm.save();
                    res.redirect('/admin/edit/' + createdUser._id);
                })
            })
        } else {
            // Found User
            let newForm = {
                    labNumber:  req.body.lab.number,
                    product: req.body.lab.product,
                    content: req.body.lab.content,
                    payment: req.body.lab.check,
                    status: req.body.lab.status,
                    customer: user._id,
                    isPayed: isPayed
                }
                Lab.create(newForm, (err, createdForm)=>{
                    if(err) throw err;
                    user.labs.push(createdForm._id);
                    user.save();
                    createdForm.notes.push(note);
                    createdForm.save();
                    res.redirect('/admin/edit/' + user._id);
                })
        }
    })
    .catch((err)=>{
        console.log(err);
        res.redirect('back');
    })
}
// Update lab form
middlewareOBJ.updateLab = (req, res) => {
    Lab.findById(req.params.labID)
    .then((foundItem) => {
        let newCost = req.body.lab.cost;
        let fixWarranty = req.body.lab.fixWarranty;
        let newStatus = req.body.lab.status;
        let newNote = {
            author: req.user.id,
            content: req.body.lab.status + " - " + req.body.lab.note,
        }
        
        foundItem.status = newStatus;
        if(newCost){
            foundItem.cost = newCost;
        }
        if(fixWarranty){
            foundItem.fixWarranty = fixWarranty;
        }
        foundItem.notes.push(newNote);
        foundItem.save();
        res.redirect('back');
    })
    .catch((err) => {
        console.log(err);
        res.redirect('back');
    })
}


module.exports = middlewareOBJ;