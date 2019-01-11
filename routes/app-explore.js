const express  = require('express');
const router   = express.Router();
const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');
const passport = require('passport');

// models
var User  = require('../models/user');


function checkuser(req, res, next) {

    // if user signups but doesn't complete all stages and navigates to explore routes ...

    if (req.user && req.user.finished == false) {

      var userId = { _id: req.user.id };

      User.findByIdAndRemove( userId, function (err, user) {
        if (!err) {
          console.log(user);
          res.redirect('/');  }
      });
    }

    // if user is logged in and navigates to explore routes ...

    if (req.isAuthenticated() && req.user.finished == true) { res.redirect('/0/auth/workspaces');  }

    else if (!req.user) { console.log('no user'); next(); };
}


const dirname = 'app-explore/auth';


router.get('/', checkuser, function(req, res) {

    res.render ('app-explore/index', { title: 'explore our app'
    });
});


router.get('/get-started',  checkuser,  function(req, res) {

    res.render (dirname+'/get-started', {
      title: 'explore our app', bodyId: 'slackr-main-page'
    });
});

router.get('/login', checkuser, function(req, res) {

    res.render (dirname+'/login', {
      title: 'explore our app', bodyId: 'slackr-main-page'
    });
});



module.exports = router;
