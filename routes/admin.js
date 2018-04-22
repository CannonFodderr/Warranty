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
        {fullName: new RegExp(query, 'i')}]
    }, (err, results) => {
        if(err){
            console.log(err);
            res.redirect('back');
        } else {
            res.render('admin', { results: results});
        }
    })
    
});

module.exports = router;



