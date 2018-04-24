const   express = require('express'),
        router = express.Router(),
        mongoose = require('mongoose'),
        expressSanitizer = require('express-sanitizer'),
        User = require('../models/user');

router.get('/', (req, res)=>{
    res.render('admin', {results: []});
});

// router.get('/q', (req, res)=> {
//     let query =  req.query.search;
//     User.find({$or:[
//         {email: new RegExp(query, 'i')}, 
//         {fullName: new RegExp(query, 'i')},
//         {'products.serial': new RegExp(query, 'i')},
//         {'products.invoice': new RegExp(query, 'i')}]
//     }, (err, results) => {
//         if(err){
//             console.log(err);
//             res.redirect('back');
//         } else {
//             res.render('admin', { results: results });
//         }
//     })
    
// });
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

// router.get('/edit/:id', (req, res) => {
//     User.findById(req.params.id, (err, foundUser) => {
//         if(err){
//             console.log(err);
//             res.redirect('back');
//         } else {
//             res.render('edit', {user: foundUser});
//         }
//     })
// });
router.get('/edit/:id', (req, res) => {
    User.findById(req.params.id)
    .then((foundUser) => {
        res.render('edit', { user: foundUser});
    })
})

// router.put('/edit/:id', (req, res) => {
//     let updateData = {
//         fullName: req.body.user.fullName,
//         email: req.body.user.email,
//         phone: req.body.user.phone
//     }
//     User.findByIdAndUpdate(req.params.id, updateData, (err, updatedUser) => {
//         if(err){
//             console.log(err);
//             res.redirect('back');
//         } else {
//             res.redirect('/admin');
//         }
//     })
// });

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

// router.get('/edit/:id/product/:productID', (req, res) => {
//     let query = req.params.productID;
//     console.log(query);
//     User.findById({products: {'_id': mongoose.Types.ObjectId(query)}}, (err, foundProduct) =>{
//         if(err){
//             console.log(err);
//             res.redirect('back');
//         } else {
//             console.log(foundProduct);
//             res.render('editProduct');
//         }
//     })
    
// });

router.get('/edit/:id/product/:productID', (req, res) => {
    let query = req.params.productID;
    User.findById(req.params.id)
    .then((user) => {
        let product = user.products.id(query);
        res.render('editProduct', {product: product});
    })
    .catch((err) => {
        console.log(err);
        res.redirect('back');
    })
})

module.exports = router;



