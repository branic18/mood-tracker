// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080; // All of your secreats will be in an env file. Put this in your git ignore. So you secrets stay locally. Your hosting provider will use a recommended port, if not they'll use the one you hard-coded (8000)
// const MongoClient = require('mongodb').MongoClient // ERROR: 
var mongoose = require('mongoose'); // Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. Provides a straight-forward, schema-based solution to model your application data
var passport = require('passport'); // Not sure what this is
var flash    = require('connect-flash');

var morgan       = require('morgan'); // Logging
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser'); // See whats coming with req

var session      = require('express-session'); // Keep logged in session alive

var configDB = require('./config/database.js');

const methodOverride = require('method-override')
app.use(methodOverride('_method'))

// configuration ===============================================================
mongoose.connect(configDB.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Mongoose connected successfully');
    require('./app/routes.js')(app, passport);
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  }); 

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')) // All static files don't need individual routes for these pieces of content

app.use(express.static('public'));;

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport- this keeps track of whether the user is logged in or not. Once there's a cookie in the browser it keeps the user logged in
app.use(session({ // Keeps us logged in, sets up session
    secret: 'moodTrack24', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session, show messages to user. This is an error message ('Email doesn't exist')

// Middleware to pass user info to every route (if the user is authenticated)
app.use((req, res, next) => {
  res.locals.user = req.user || null; // Make user available in all views
  next();
});

// launch ======================================================================
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on port ${port}`);
});
