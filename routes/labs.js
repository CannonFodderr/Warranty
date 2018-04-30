const   express     = require('express'),
        router      = express.Router(),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        middleware  = require('../middleware'),
        expressSanitizer = require('express-sanitizer'),
        Admin       = require('../models/admin'),
        User        = require('../models/user'),
        Lab         = require('../models/lab');

        router.get('/lab/new',middleware.isAdmin, (req, res)=> res.render('lab/new'));

// Find if user email exsists then update or create new if not 
router.post('/lab/new',middleware.isAdmin, (req, res) => {
    let isPayed = false;
    if(req.body.lab.isPayed == "on"){
        isPayed = true;
    }
    let userData = {
        email: req.body.user.email,
        fullName: req.body.user.name,
        phone: req.body.user.phone
    }
    
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
                    payment: req.body.lab.payment,
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
                    payment: req.body.lab.payment,
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
});
// New lab form for customer
router.get('/edit/:id/labs/new',middleware.isAdmin, (req, res) => {
    User.findById(req.params.id)
    .then((foundUser) => {
        res.render('lab/userNew', {user: foundUser});
    })
    .catch((err)=>{
        console.log(err);
        res.redirect('back');
    })
})
// View lab details
router.get('/edit/:id/labs/:labID',middleware.isAdmin, (req, res) => {
    Lab.findById(req.params.labID).populate("customer").populate("notes.author").exec()
    .then((item)=>{
        res.render('lab/view', {item: item});
    })
    .catch((err)=>{
        console.log(err);
        res.redirect('back');
    })
});

// Submit new note to lab
router.put('/edit/:id/labs/:labID',middleware.isAdmin, (req, res) => {
    Lab.findById(req.params.labID)
    .then((foundItem) => {
        let newNote = {
            author: req.user.id,
            content: req.body.lab.note
        }
        foundItem.notes.push(newNote);
        foundItem.save();
        res.redirect('back');
    })
    .catch((err) => {
        console.log(err);
        res.redirect('back');
    })
})




module.exports = router