const express = require('express'),
        app = express(),
        bodyParser = require('body-parser'),
        expressSanitizer = require('express-sanitizer'),
        path = require('path'),
        mongoose = require('mongoose'),
        env = require('dot-env'),
        port = process.env.PORT, /* || 8080, */
        dburl = process.env.DB_URL; /* || 'mongodb://localhost/warranty';*/

// Routes
const indexRoutes = require('./routes/index');
//  DB Config
mongoose.connect(dburl);
// APP Config
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname + '/public')));
app.use(expressSanitizer());

app.use((req, res, next) => {
        res.locals.msg = "";
        next();
})

app.use(indexRoutes);



app.listen(port, (req, res) => console.log(`Server is running on ${port}`));