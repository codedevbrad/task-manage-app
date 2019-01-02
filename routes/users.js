

const express  = require('express');

const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');

const bcrypt   = require('bcryptjs');
const passport = require('passport');
const router   = express.Router();

// models
var User  = require('../models/user');


// login route process
router.post('/user/auth/login', passport.authenticate('local', {
		failureRedirect:'/login',
		failureFlash:' wrong username or password.'
	}),
  function(req, res) {
  	res.redirect('/0/auth/workspaces');
});


router.get('/user/auth/username/:id', function(req, res) {

		// promise based user search ...
		var promise = User.findOne( { username: req.params.id } ).exec();

		promise.then(function(user) {
			if (!user) { res.send( 'blue'); }
			else       { res.send( 'red' ); }
		})
		.catch(function(err) {
			console.log(err);
		});
});


// register new user
router.post('/user/auth/register', function(req, res, next ) {

    const username  = req.body.username.toLowerCase();
    const password  = req.body.password;
    const email     = req.body.email;

		var errors = false;

    function checkErrors() {

			  // check fields
				req.checkBody('email',    'Email is required').notEmpty();
				req.checkBody('username', 'Username is required').notEmpty();
				req.checkBody('password', 'password is required').notEmpty();
				req.checkBody('email',    'Email is not valid').isEmail();
				errors = req.validationErrors();

				return errors;
	  }

	 if (checkErrors())  { res.redirect('/get-started'); }

	 if (!checkErrors()) {

       var newUser = new User();
       newUser.email    = email, newUser.username = username, newUser.password  = password,
       newUser.team     = [],    newUser.notifications = [],  newUser.workspace = []

     // encypt the plaintext password
     bcrypt.genSalt(10, function(err, salt) {
       bcrypt.hash(newUser.password, salt, function(err, hash) {
         if(err) {  console.log(err) }

				 newUser.password = hash;

         newUser.save(function(err)  {
           if (err) { console.log(err)   }
           else     {
               passport.authenticate('local', {
                 successRedirect: '/0/auth/workspaces/', failureRedirect: '/get-started'
               }) (req, res, next)
            }
         });
       });
     });
  }
});

// logout route process
router.get('/0/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
