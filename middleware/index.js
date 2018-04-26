const middlewareOBJ = {};

middlewareOBJ.formIsFilled = (req, res, next) => {
    if( req.body.user.fullName < 4 || 
        req.body.user.invoice < 6 ||
        req.body.user.productName < 4 ||
        req.body.user.serial < 8 ) {
            res.render('index', {msg: "Incorrect Details"});

        } else {
            next();
        }
}

middlewareOBJ.isAdmin = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}

module.exports = middlewareOBJ;