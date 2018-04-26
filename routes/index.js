const   express             = require('express'),
        router              = express.Router(),
        request             = require('request');
        passport            = require('passport'),
        captchaKey          = process.env.CAPTCHA,
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
    res.render('index', {captcha: captchaKey});
});
// Post a new form
router.post('/register',formIsFilled, (req, res) => {
    let sanitizedName = req.sanitize(req.body.user.fullName);
    let sanitizedNote = req.sanitize(req.body.user.note);
    let newUser = {
        email: req.body.user.email,
        fullName: sanitizedName,
        phone: req.body.user.phone
    }
    let newProduct = {
        invoice: req.body.user.invoice,
        productName: req.body.user.productName,
        serial: req.body.user.serial,
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

router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/');
});

module.exports = router;

