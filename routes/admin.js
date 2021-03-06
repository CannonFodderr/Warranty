const   express     = require('express'),
        router      = express.Router(),
        fs          = require('fs'),
        path        = require('path'),
        bodyParser = require('body-parser'),
        mongoose    = require('mongoose'),
        passport    = require('passport'),
        multer      = require('multer'),
        middleware  = require('../middleware'),
        permissions = require('../middleware/permissions'),
        expressSanitizer = require('express-sanitizer'),
        Admin       = require('../models/admin'),
        User        = require('../models/user'),
        Lab         = require('../models/lab');


router.get('/',middleware.isAdmin, (req, res)=>{
    res.render('admin/admin', {results: [], title: 'חיפוש'});
});

router.get('/register',middleware.checkAdminPermissions, (req, res) => {
    res.render('admin/register', {title: 'רישום מנהל'});
});

router.post('/register',middleware.checkAdminPermissions, (req, res) => {
    let newAdmin = {
        username: req.body.admin.username,
        permissions: req.body.permissions
    }
    Admin.register(newAdmin, req.body.admin.password )
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
        res.render('admin/admin', {results: results, title: 'תוצאות חיפוש'});
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/');
    });
});

router.get('/edit/:id',middleware.isAdmin, (req, res) => {
    User.findById(req.params.id).populate("labs").exec(function(err,foundUser){
        if(err) throw err;
        let todayDate = Date.now();
        res.render('admin/edit', {user: foundUser, today:todayDate, title: 'פרטי לקוח'});
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
        res.render('admin/editProduct', {product: product, user:user, title:'פרטי מוצר', msg: ""});
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

// UPLOAD product file
router.post('/edit/:id/product/:productID/upload', middleware.isAdmin, (req, res)=>{
    User.findById(req.params.id).then((foundUser)=>{
        let fileName = "";
        let product = foundUser.products.id(req.params.productID);
        const invoice = foundUser.products.id(req.params.productID).invoice;
        const userPath = foundUser.email + '/';
        const invoicePath = foundUser.email + '/' + invoice + '/';
        if(!fs.existsSync('./uploads/' + userPath)){
            fs.mkdirSync('./uploads/' + userPath);
            fs.mkdirSync('./uploads/' + invoicePath);
            console.log('Creating all directories');
        } else if(!fs.existsSync('./uploads/' + invoicePath)){
            fs.mkdirSync('./uploads/' + invoicePath);
            console.log('creating invoice direcotry');
        } else {
            console.log('Adding files to directory');
        }
        // Upload vars
        const storage = multer.diskStorage({
            destination: (req, file, cb)=>{
                cb(null, './uploads/' + invoicePath)
            },
            filename: (req, file, cb) => {
                cb(null, file.originalname);
                fileName = file.originalname;
            }
        });
        const upload = multer({
            storage: storage,
            limits: {
                fileSize: 1000000
            },
            fileFilter: function (req, file, cb) {
                var filetypes = /jpeg|jpg|png|pdf/;
                var mimetype = filetypes.test(file.mimetype);
                var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                if (mimetype && extname) {
                  return cb(null, true);
                }
                cb("Error: File upload only supports the following filetypes - " + filetypes);
                res.render('admin/editProduct', 
                {product: product, user:foundUser, title:'פרטי מוצר', msg: 'הקובץ לא מתאים נסה להעלות קבצי ' + filetypes});
            } 
        }).single('productFile');
        upload(req,res, (e)=>{
            if(e){
                console.error(e);
                if(e.code === 'LIMIT_FILE_SIZE'){
                    res.render('admin/editProduct', {product: product, user:foundUser, title:'פרטי מוצר', msg: 'הקובץ גדול מידי :('});
                }
            } else {
                foundUser.products.id(req.params.productID).file = '/uploads/' + invoicePath + fileName;
                foundUser.save();
                res.render('admin/editProduct', {product: product, user:foundUser, title:'פרטי מוצר', msg: 'הקובץ עודכן בהצלחה!'});
            }
        })
        
    }).catch((e)=>{
        console.error(e);
    })
})
router.get('/uploads/:userEmail/:productInvoice/:fileName',middleware.isAdmin, (req, res)=>{
    const filePath = "./uploads/" + req.params.userEmail + '/' + req.params.productInvoice + '/' + req.params.fileName;
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
});

router.delete('/:userID/:productID/uploads/:useremail/:invoice/:filename', (req, res)=>{
    User.findById(req.params.userID).then((foundUser)=>{
        const product = foundUser.products.id(req.params.productID);
        console.log(product);
        product.file = "";
        foundUser.save();
        console.log('Deleted from DB');
        const deletePath = './uploads/' + req.params.useremail + '/' + req.params.invoice + '/' + req.params.filename;
        console.log(deletePath);
        fs.unlink(deletePath, (e)=>{
            if(e){
                console.error(e);
                res.redirect('back');
            } else {
                console.log('file was deleted from Server');
                res.render('admin/editProduct', {product: product, user:foundUser, title:'פרטי מוצר', msg: 'קובץ נמחק בהלחה'});

            }
        })
    }).catch((e)=>{
        console.error(e);
        res.render('admin/editProduct', {product: product, user:foundUser, title:'פרטי מוצר', msg: 'תקלה במחיקת הקובץ'});
    })
    
})
module.exports = router;



