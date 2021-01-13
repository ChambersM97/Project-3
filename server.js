// dependencies
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require("express");
const morgan = require("morgan");
const passport = require('passport');
const exphbs = require('express-handlebars');
const session = require('express-session');
const connectFlash = require('connect-flash');
// const initWebRoutes = require('./routes/user');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');

const apiRoutes = require('./routes');
const app = express();

// app.use(morgan('tiny'));

//use cookie parser
app.use(cookieParser('secret'));

//config session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 86400000 1 day
    }
}));



// Enable body parser post data
app.use(bodyParser.json());

// app.use(bodyParser.urlencoded({ extended: true }));

//Enable flash message
app.use(connectFlash());

//Config passport middleware
app.use(passport.initialize());
app.use(passport.session());

// init all web routes
app.use(apiRoutes);


let port = process.env.PORT || 8080

app.listen(port, () => console.log(`Building a login system with NodeJS is running on port ${port}!`));