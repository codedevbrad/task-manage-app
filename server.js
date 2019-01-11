
// package inludes
const express = require('express');
const path    = require('path');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');

const expressValidator = require('express-validator');
const flash   = require('connect-flash');
const session = require('express-session');

const passport = require('passport');


// db initialize
const config   = require('./config/database');
mongoose.connect(config.database);
var db = mongoose.connection;


// check db connection
db.once('openUri', function() { console.log('Connected to mongoDB ...');
});

// check for db err
db.on('error', function(err) { console.log(err);
});


// initialiase app
const app    = express();
const server = require('http').createServer(app);

app.use('/main',         express.static(path.join(__dirname, 'front-end/')));


// initialize explore app
app.use('/app-explore',  express.static(path.join(__dirname, 'front-end/app-explore/')));
app.use('/build',        express.static(path.join(__dirname, 'front-end/node_modules/')));

// initialize server app
app.use('/app-server',  express.static(path.join(__dirname, 'front-end/app-server')));



// bring in pug
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');


// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
// set public folder
app.use(express.static(path.join(__dirname, 'public')));


// express session

app.use(session ({
  secret: 'keyboard cat', resave: true, saveUninitialized: true
}));


// express  messages middleware
app.use(require('connect-flash')());

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages') (req, res);
  next();
});


// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
    var namespace = param.split('.'), root    = namespace.shift(), formParam = root;
    while(namespace.length) { formParam += '[' + namespace.shift() + ']';  }
    return {  param : formParam, msg : msg,  value : value  };
  }
}));


// passport config
require('./config/passport')    (passport)
app.use(passport.initialize()); app.use(passport.session());


// pass user to all routes ...
app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;

  next();
});



// app-explore routes

  var explore = require('./routes/app-explore'); app.use('/', explore);


// app-server routes ...

  // workspace route ...
  var workspace = require('./routes/workspace'); app.use('/', workspace);

  // users route ...
  var users   = require('./routes/users');  app.use('/', users);


// start server ...
server.listen(process.env.PORT || 3000, function(req, res) {
    console.log('server started');
});


//
