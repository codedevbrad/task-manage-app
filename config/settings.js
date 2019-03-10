
const express = require('express');
const path    = require('path');

const expressValidator = require('express-validator');
const flash   = require('connect-flash');
const session = require('express-session');

module.exports = {
   
   paths: function( app , dirname) {
     // front-end folder structure
     app.use('/main',         express.static(path.join(dirname, 'front-end/')));

     // initialize explore app
     app.use('/app-explore',  express.static(path.join(dirname, 'front-end/app-explore/')));
     app.use('/build',        express.static(path.join(dirname, 'front-end/node_modules/')));

     // initialize server app
     app.use('/app-server',   express.static(path.join(dirname, 'front-end/app-server')));

   },

   config:  function( app ) {
     // express session
     app.use(session ({
       secret: 'keyboard cat',
       cookie: { maxAge: 960000,  _expires : 500000 },
       resave: true, saveUninitialized: true, rolling: true
     }));

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

   }
};
