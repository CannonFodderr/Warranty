const express = require('express'),
        router = express.Router(),
        User = require('../models/user');


router.get('/', (req, res) => res.redirect('/register'));
router.get('/register', (req, res) => {
    res.render('index');
});
router.post('/register', (req, res) => {
    let newUser = {
        email: req.body.user.email,
        fullName: req.body.user.fullName
    }
    let newProduct = {
        invoice: req.body.user.invoice,
        productName: req.body.user.productName,
        serial: req.body.user.serial
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
                    res.redirect('/');
                } else {
                    createdUser.products.push(newProduct);
                    createdUser.save();
                    res.redirect('/');
                }
            })
        } else {
            console.log('Found Email adding to products array');
            foundEmail.products.push(newProduct);
            foundEmail.save();
            res.redirect('/');
        }
    });
});

module.exports = router;