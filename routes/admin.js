const   express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        passport = require('passport'),
        expressSanitizer = require('express-sanitizer'),
        Admin = require('../models/admin'),
        User = require('../models/user');

let isAdmin = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

router.get('/',isAdmin, (req, res)=>{
    res.render('admin/admin', {results: []});
});

router.get('/register',isAdmin, (req, res) => {
    res.render('admin/register');
});

router.post('/register',isAdmin, (req, res) => {
    Admin.register({username: req.body.admin.username}, req.body.admin.password )
    .then((createdAdmin) =>{
        console.log("New Admin created");
        res.redirect('/admin/login');
    })
    .catch((err)=>{
        console.log(err);
        res.redirect('back');
    })
})

router.get('/q', (req, res) => {
    let query = req.query.search;
    User.find({$or: [
        {email: new RegExp(query, 'i')},
        {fullName: new RegExp(query, 'i')},
        {'products.serial': new RegExp(query, 'i')},
        {'products.invoice': new RegExp(query, 'i')}
    ]})
    .then((results) => {
        res.render('admin/admin', {results: results});
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/');
    });
});

router.get('/edit/:id',isAdmin, (req, res) => {
    User.findById(req.params.id)
    .then((foundUser) => {
        res.render('admin/edit', { user: foundUser});
    })
})

router.put('/edit/:id',isAdmin, (req, res) => {
    let updateData = {
        fullName: req.body.user.fullName,
        email: req.body.user.email,
        phone: req.body.user.phone
    };
    User.findByIdAndUpdate(req.params.id, updateData)
    .then((updatedUser) => {
        res.redirect('back');
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/admin');
    });
});

router.get('/edit/:id/product/:productID',isAdmin, (req, res) => {
    let query = req.params.productID;
    User.findById(req.params.id)
    .then((user) => {
        let product = user.products.id(query);
        res.render('admin/editProduct', {product: product, user:user});
    })
    .catch((err) => {
        console.log(err);
        res.redirect('back');
    });
});

// Update product details
router.put('/edit/:id/product/:productID',isAdmin, (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id, 'products._id': req.params.productID}, {
        'products.$.name': req.body.user.productName,
        'products.$.invoice': req.body.user.invoice,
        'products.$.serial': req.body.user.serial,
        'products.$.store': req.body.store
    })
    .then((updated) => {
        console.log(updated);
        res.redirect('/admin');
    })
    .catch((err) => {
        console.log(err);
        res.redirect('back');
    })
});
module.exports = router;



