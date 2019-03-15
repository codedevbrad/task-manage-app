
// package inludes
const express = require('express');
const path    = require('path');
const favicon = require('serve-favicon')

const bodyParser = require('body-parser');
const mongoose   = require('mongoose');

const passport = require('passport');
const methodOverride = require('method-override');

// initialiase app
const app    = express();
const server = require('http').createServer(app);


// export server file
module.exports.serverExport = function () {
  return server;
}


// initialize needed middleware
var settings = require('./config/settings');
settings.config(app);
settings.paths(app, __dirname);
app.use(favicon(path.join(__dirname, 'front-end', 'favicon2.png')))


// require flash messages for login
app.use(require('connect-flash')());

// image upload middleware
app.use(methodOverride('_method'));

// bring in pug
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'pug');

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }))
// parse application/json
app.use(bodyParser.json())
// set public folder
app.use(express.static(path.join(__dirname, 'public')));


// passport config
require('./config/passport') (passport)
app.use(passport.initialize()); app.use(passport.session());

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

// pass user to all routes ...
app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;  next();
});


var testMiddleware = require('./routes/middleware/testMiddleware');
// testMiddleware.startIo('test');

// var push = testMiddleware.push();
// push();

// using middleware
// app.use(testMiddleware.test());

// exporting an object method
// testMiddleware.getValue( app , __dirname );

// exporting a self-invoked function
// testMiddleware.startIo();

// exporting a inner function .
// var test = testMiddleware.push();
// var push = test();
// console.log( push );


// app-explore routes

  var explore = require('./routes/app-explore'); app.use('/', explore);

// app-server routes ...

  // workspace route ...
  var workspace = require('./routes/workspace'); app.use('/', workspace);

  // users route ...
  var users   = require('./routes/users');  app.use('/', users);

  // aside
  var sidebar = require('./routes/side-app'); app.use('/', sidebar);

// tests

  var test = require('./routes/tests/apiTests'); app.use('/', test);


// start server ...
server.listen(process.env.PORT || 3000, function(req, res) {
    console.log('server started');
});
