const   express = require('express'),
        router = express.Router(),
        expressSanitizer = require('express-sanitizer'),
        User = require('../models/user');

router.get('/', (req, res)=>{
    res.render('admin', {results: []});
});

router.get('/q', (req, res)=> {
    let query =  req.query.search;
    User.find({$or:[
        {email: new RegExp(query, 'i')}, 
        {fullName: new RegExp(query, 'i')},
        {'products.serial': new RegExp(query, 'i')},
        {'products.invoice': new RegExp(query, 'i')}]
    }, (err, results) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.render('admin', { results: results });
        }
    })
    
});

router.get('/edit/:id', (req, res) => {
    User.findById(req.params.id, (err, foundUser) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.render('edit', {user: foundUser});
        }
    })
});

router.put('/edit/:id', (req, res) => {
    let updateData = {
        fullName: req.body.user.fullName,
        email: req.body.user.email,
        phone: req.body.user.phone
    }
    User.findByIdAndUpdate(req.params.id, updateData, (err, updatedUser) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/admin');
        }
    })
})

module.exports = router;



