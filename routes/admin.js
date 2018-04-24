const   express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        expressSanitizer = require('express-sanitizer'),
        User = require('../models/user');

router.get('/', (req, res)=>{
    res.render('admin', {results: []});
});

router.get('/q', (req, res) => {
    let query = req.query.search;
    User.find({$or: [
        {email: new RegExp(query, 'i')},
        {fullName: new RegExp(query, 'i')},
        {'products.serial': new RegExp(query, 'i')},
        {'products.invoice': new RegExp(query, 'i')}
    ]})
    .then((results) => {
        res.render('admin', {results: results});
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/');
    });
});

router.get('/edit/:id', (req, res) => {
    User.findById(req.params.id)
    .then((foundUser) => {
        res.render('edit', { user: foundUser});
    })
})

router.put('/edit/:id', (req, res) => {
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

router.get('/edit/:id/product/:productID', (req, res) => {
    let query = req.params.productID;
    User.findById(req.params.id)
    .then((user) => {
        let product = user.products.id(query);
        res.render('editProduct', {product: product, user:user});
    })
    .catch((err) => {
        console.log(err);
        res.redirect('back');
    });
});

// Update product details
router.put('/edit/:id/product/:productID', (req, res) => {
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



