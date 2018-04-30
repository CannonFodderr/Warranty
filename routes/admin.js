const   express     = require('express'),
        router      = express.Router(),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        middleware  = require('../middleware'),
        expressSanitizer = require('express-sanitizer'),
        Admin       = require('../models/admin'),
        User        = require('../models/user'),
        Lab         = require('../models/lab');

router.get('/',middleware.isAdmin, (req, res)=>{
    res.render('admin/admin', {results: []});
});

router.get('/register',middleware.isAdmin, (req, res) => {
    res.render('admin/register');
});

router.post('/register',middleware.isAdmin, (req, res) => {
    Admin.register({username: req.body.admin.username}, req.body.admin.password )
    .then((createdAdmin) =>{
        console.log("New Admin created");
        res.redirect('/login');
    })
    .catch((err)=>{
        console.log(err);
        res.redirect('back');
    })
});

router.get('/q',middleware.isAdmin, (req, res) => {
    let query = req.query.search;
    User.find({$or: [
        {email: new RegExp(query, 'i')},
        {fullName: new RegExp(query, 'i')},
        {'products.serial': new RegExp(query, 'i')},
        {'products.invoice': new RegExp(query, 'i')}
    ]})
    .lean()
    .then((results) => {
        res.render('admin/admin', {results: results});
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/');
    });
});

router.get('/edit/:id',middleware.isAdmin, (req, res) => {
    User.findById(req.params.id).populate("labs").exec(function(err,foundUser){
        if(err) throw err;
        res.render('admin/edit', {user: foundUser});
    })
})

router.put('/edit/:id',middleware.isAdmin, (req, res) => {
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

router.get('/edit/:id/product/:productID',middleware.isAdmin, (req, res) => {
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
router.put('/edit/:id/product/:productID',middleware.isAdmin, (req, res) => {
    User.findOneAndUpdate({ _id: req.params.id, 'products._id': req.params.productID}, {
        'products.$.productName': req.body.user.productName,
        'products.$.invoice': req.body.user.invoice,
        'products.$.serial': req.body.user.serial,
        'products.$.note': req.body.user.note,
        'products.$.store': req.body.store
    })
    .then((updated) => {
        res.redirect('/admin');
    })
    .catch((err) => {
        console.log(err);
        res.redirect('back');
    })
});

router.delete('/edit/:id/product/:productID', middleware.isAdmin, (req, res) => {
    User.findById(req.params.id)
    .then((user)=>{
        user.products.id(req.params.productID).remove();
        user.save();
        res.redirect('/admin');
    })
    .catch((err)=>{
        console.log(err);
        res.redirect('back');
    })
});


module.exports = router;



