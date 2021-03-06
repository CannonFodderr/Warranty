const   express                 = require('express'),
        app                     = express(),
        bodyParser              = require('body-parser'),
        expressSanitizer        = require('express-sanitizer'),
        fs                      = require('fs'),
        multer                  = require('multer'),
        methodOverride          = require('method-override'),
        path                    = require('path'),
        mongoose                = require('mongoose'),
        passport                = require('passport'),
        LocalStrategy           = require('passport-local'),
        passportLocalMongoose   = require('passport-local-mongoose'),
        env                     = require('dot-env'),
        secret                  = process.env.SECRET,
        captchaKey              = process.env.CAPTCHA,
        Admin                   = require('./models/admin'),
        port                    = process.env.PORT || 8080,
        dburl                   = process.env.DB_URL || "mongodb://localhost/warranty"; 

// Routes
const   indexRoutes = require('./routes/index'),
        adminRoutes = require('./routes/admin'),
        labsRoutes = require('./routes/labs');
//  DB Config
mongoose.connect(dburl);
// APP Config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname + '/public/')));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(require('express-session')({
        secret: secret,
        saveUninitialized: false,
        resave: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.disable('x-powered-by');

// Auth Config
passport.use(new LocalStrategy(Admin.authenticate()));
passport.serializeUser(Admin.serializeUser());
passport.deserializeUser(Admin.deserializeUser());

// res locals
app.use((req, res, next) => {
        res.locals.msg = "";
        res.locals.currentAdmin = req.user;
        next();
})

app.use(indexRoutes);
app.use('/admin', adminRoutes);
app.use('/admin', labsRoutes);


app.listen(port, (req, res) => console.log(`Server is running on ${port}`));