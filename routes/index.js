const express               = require('express'),
        router              = express.Router(),
        passport            = require('passport'),
        expressSanitizer    = require('express-sanitizer'),
        User                = require('../models/user');

formIsFilled = (req, res, next) => {
    if( req.body.user.fullName < 4 || 
        req.body.user.invoice < 6 ||
        req.body.user.productName < 4 ||
        req.body.user.serial < 8 ) {
            res.render('index', {msg: "Incorrect Details"});

        } else {
            next();
        }
}

router.get('/', (req, res) => res.redirect('/register'));
// Display form page
router.get('/register', (req, res) => {
    res.render('index');
});
// Post a new form
router.post('/register',formIsFilled, (req, res) => {
    let sanitizedName = req.sanitize(req.body.user.fullName);
    let newUser = {
        email: req.body.user.email,
        fullName: sanitizedName,
        phone: req.body.user.phone
    }
    let newProduct = {
        invoice: req.body.user.invoice,
        productName: req.body.user.productName,
        serial: req.body.user.serial,
        store: req.body.store
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
                    alert("נתקלנו בבעיה אנא מלא את הטופס שנית");
                    res.redirect('/');
                } else {
                    createdUser.products.push(newProduct);
                    createdUser.save();
                    alert("ההרשמה בוצעה בהצלחה!");
                    res.redirect('/register');
                }
            })
        } else {
            console.log('Found Email adding to products array');
            foundEmail.products.push(newProduct);
            foundEmail.save();
            alert("ההרשמה נוספה בהצלחה!");
            res.redirect('/register');
        }
    });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', passport.authenticate('local', 
        { 
            failureRedirect: '/login',
            successRedirect: '/admin'
        }
));

module.exports = router;

