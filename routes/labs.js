const   express     = require('express'),
        router      = express.Router(),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        middleware  = require('../middleware'),
        expressSanitizer = require('express-sanitizer'),
        Admin       = require('../models/admin'),
        User        = require('../models/user'),
        Lab         = require('../models/lab');

router.get('/lab/new',middleware.isAdmin, (req, res)=> res.render('lab/new', {title: 'טופס מעבדה חדש'}));

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
    middleware.createNewLab(req, res, isPayed, userData);
});
// New lab form for customer
router.get('/edit/:id/labs/new',middleware.isAdmin, (req, res) => {
    User.findById(req.params.id)
    .then((foundUser) => {
        res.render('lab/userNew', {user: foundUser, title:'טופס מעבדה למשתמש'});
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
        let oneDay = 24 * 60 * 60 * 1000;
        let fixWarrantyDays = oneDay * item.fixWarranty;
        let todayDate = Date.now();
        let timeSinceCreated = Math.floor(Math.abs((item.date - todayDate)/oneDay));
        let timeSinceUpdated = Math.floor((item.fixWarranty - todayDate )/oneDay);
        res.render('lab/view', {item: item, time:timeSinceCreated, fixWarranty: timeSinceUpdated, title: 'פרטי מעבדה'});
    })
    .catch((err)=>{
        console.log(err);
        res.redirect('back');
    })
});

// Submit new note to lab
router.put('/edit/:id/labs/:labID',middleware.isAdmin, (req, res) => {
    middleware.updateLab(req, res);
});

router.put('/edit/:id/labs/:labID/pay', middleware.isAdmin, (req, res) => {
    Lab.findById(req.params.labID)
    .then((item) => {
        if(req.body.lab.isPayed == "on"){
            isPayed = true;
        } else {
            isPayed = false;
        }
    
        item.cost = item.cost - req.body.lab.cost;
        item.isPayed = isPayed;
        item.save();
        res.redirect('back');
    })
    .catch((err) =>{
        console.log(err);
        res.redirect('back');
    })
})




module.exports = router