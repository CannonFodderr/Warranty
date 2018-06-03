const   express             = require('express'),
        router              = express.Router(),
        fs                  = require('fs'),
        request             = require('request'),
        passport            = require('passport'),
        middleware          = require('../middleware'),
        captchaKey          = process.env.CAPTCHA,
        expressSanitizer    = require('express-sanitizer'),
        User                = require('../models/user');

router.get('/', (req, res) => res.redirect('/register'));
// Display form page
router.get('/register', (req, res) => {
    res.render('index', {captcha: captchaKey, title: 'רישום מוצר'});
});
// Post a new form
router.post('/register',middleware.formIsFilled, (req, res) => {
    middleware.newRegisterForm(req, res);
});

router.get('/login', (req, res) => {
    res.render('login', {title: 'כניסה למערכת'});
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

router.get('/uploads/:userEmail/:productInvoice/:fileName',middleware.isAdmin, (req, res)=>{
    const filePath = "./uploads/" + req.params.userEmail + '/' + req.params.productInvoice + '/' + req.params.fileName;
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
})
module.exports = router;

