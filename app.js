const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const passport = require('passport');
// const session = require('cookie-session');
const session = require('express-session');
const MongoStore = require('connect-mongo');
// const expressHBS = require('express-handlebars');
const { engine } = require('express-handlebars');
const { default: mongoose } = require('mongoose');


// load config
dotenv.config({path: './config/.env'});
connectDB();
const app = express();

// body parser middleware
app.use(express.urlencoded({extended:false}));
app.use(express.json())

// logging
if (process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

// load passport
require('./config/passport')(passport);

//handlebars 
// app.engine('.hbs', expressHBS.engine({defaultLayout:'main', extname: '.hbs'}));
app.engine('.hbs', engine({defaultLayout:'main', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', './views');

// static settings
app.use(express.static(path.join(__dirname, 'public')));

// session middleware 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,})
  }));

  // passport middleware
  app.use(passport.initialize());
  app.use(passport.session());

// load passport
require('./config/passport')(passport);

// base routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/opinions', require('./routes/opinions'));

const PORT = process.env.PORT || 5000; 
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
