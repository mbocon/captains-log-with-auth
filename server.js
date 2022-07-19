// Dependencies

const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const session = require('express-session');
const methodOverride = require('method-override');
const logsController = require('./controllers/logs');
const usersController = require('./controllers/users');
require('dotenv').config();

// Initialize the App
const app = express();

// Configure the app settings
const { DATABASE_URL, PORT, SECRET } = process.env;

// Database connection

mongoose.connect(DATABASE_URL);

const db = mongoose.connection;

db.on('error', (error) => {
    console.error(error.message + 'mongoDB error!');
});

db.on('connected', () => {
    console.log('mongoDB connected');
});

db.on('disconnected', () => {
    console.log('mongoDB disconnected');
});

// Middleware
app.use(express.urlencoded({ extended: false })); // body-parser
app.use(express.static('public')); // Makes assets in public folder available to the application.
app.use(methodOverride('_method')); // Allow us to use PUT and DELETE methods in our forms
app.use(morgan('dev')); // HTTP logger middleware - it logs https messages to the console
app.use(session({ // Session middleware
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));

// Create our own middleware that will set the currently logged in user to the res.locals object
app.use(async function (req, res, next) {
    if (req.session && req.session.user) {
        const user = await require('./models/user').findById(req.session.user)
        res.locals.user = user;
    } else {
        res.locals.user = null;
    }
    next();
});



// Mount routes
app.get('/', (req, res) => {
    res.redirect('/logs');
});

// Router middleware
app.use('/logs', logsController);
app.use('/users', usersController);

// Listen on PORT
app.listen(PORT, () => {
    console.log(`Express is listening on PORT ${PORT}`);
});




