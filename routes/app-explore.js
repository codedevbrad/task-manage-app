const express  = require('express');
const router   = express.Router();
const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');
const passport = require('passport');

// models
var User  = require('../models/user');


function checkuser(req, res, next) {

    // if user signups but doesn't complete all stages and navigates to explore routes ...

    if (req.user && req.isAuthenticated() && req.user.finished == false) {

        var userId = { _id: req.user._id };

        User.findByIdAndRemove( userId, function (err, user) {
          if (!err && user) { res.redirect('/');  }
          else { console.log( user ); }
        });
    }

    // if user is logged in and navigates to explore routes ...

    if (req.isAuthenticated() && req.user.finished == true) {
        res.redirect('/0/auth/workspaces');
    }

    else if (!req.user) {
        next();
    };
}


const dirname = 'app-explore/auth';


router.get('/', checkuser, function(req, res) {

    res.render ('app-explore/index', {
       title: 'explore our app'
    });
});

router.get('/get-started',  checkuser,  function(req, res) {

    var user  = req.query.username;
    var email = req.query.email;
    var pass  = req.query.password;
    console.log( email, pass );

    res.render (dirname + '/get-started', {
      title: 'explore our app', bodyId: 'slackr-main-page',
      passError: pass ? true : false , emailError: email ? true : false , usernameError: user ? true : false
    });
});

router.get('/login', checkuser, function(req, res) {

    res.render (dirname+'/login', {
      title: 'explore our app', bodyId: 'slackr-main-page'
    });
});



module.exports = router;
