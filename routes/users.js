

const express  = require('express');

const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');

const bcrypt   = require('bcryptjs');
const passport = require('passport');
const router   = express.Router();

// models
var User  = require('../models/user');
var Space = require('../models/workspace');
var Tokens = require('../models/token');

// login route process
router.post('/user/auth/login', passport.authenticate('local', {
		failureRedirect: '/login',
		failureFlash:    'wrong username or password.'
	}),
  function(req, res) {
  	res.redirect('/0/auth/workspaces');
});


function getUsername ( value ) {

	  	return User.findOne( { username: value } );
};

// register - step 1 : initial register / creates account ...

router.post('/user/auth/register/', function(req, res, next) {

	// get body id's

	const username  = req.body.username.toLowerCase();
	const password  = req.body.password;
	const email     = req.body.email;

  // search user Id mongoose > pass user
	var promise = User.findOne( { username: username }).exec();

	promise.then( user => {
			var errors = [];
			// check fields
			req.checkBody('email', '!empty').notEmpty();
			req.checkBody('email', '!valid').isEmail();

			req.checkBody('username', '!empty').notEmpty();

			req.checkBody('password', '!empty').notEmpty();
			req.checkBody('password', '!length').isLength( { min: 4 });

			errors = req.validationErrors();

		  if (user) {
				  if (!errors) { errors = [] }
					errors.push( { param: 'username', msg: '!taken', value: username });
			}

			return errors;

	})
	// test results and send to appropriate routes ...
	.then( errors => {

		  console.log( errors );

			if (errors) {
							var queryAppend = '';
							for ( var error = 0; error < errors.length; error++) {
									queryAppend = queryAppend + '&' + errors[error].param + '=' + errors[error].msg;
							}
							var newUserQuery = queryAppend.slice(1);

							res.redirect('/get-started?'+newUserQuery);
						  return Promise.reject( 'errors occured', errors );
			}
			else {	return true;	}
	})

	.then( result => {

				console.log( result );

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
			 						 successRedirect: '/user/auth/register/type', failureRedirect: '/get-started'
			 					 }) (req, res, next)
			 				}
			 		 });
			 	 });
			  });
	})
	.catch(err => {	console.log( err );	});

});


// register - check if username exists ...

router.post('/user/auth/username/:id', function(req, res) {

		// promise based user search ...
		var promise = User.findOne( { username: req.params.id } ).exec();

		promise.then(function(user) {
			if (!user) { res.send( {  class: 'success-msg',  msg: 'great username choice'} ); }
			else       { res.send( {  class: 'error-msg',    msg: 'username is taken, sorry'} ); }
		})
		.catch(function(err) { console.log(err);	});
});

// user will be signed in and complete the next 2 stages


// middleware idea
var registerAuth = function (req, res, next) {

    return next();
};

// register - step 2 : choosing the membersip type ...

router.get('/user/auth/register/type', registerAuth, function(req, res) {

		res.render ( 'app-explore/auth/register-type', {
			title: 'explore our app', bodyId: 'slackr-main-page', prev: '#', input: req.user.username
		});
});



router.post('/user/auth/register/type', registerAuth, function(req, res) {
		var condition = req.body.membertype;

		var teamIsLead = null;
		var route  = null;

		if (condition == 1) { teamIsLead = true;  route = 'leader';	}
		else                { teamIsLead = false; route = 'member'; }

		User.findByIdAndUpdate( { _id: req.user.id }, { teamIsLead: teamIsLead }, { new: true }, function( err, user ) {
				if (user && !err) {
					res.redirect('/user/auth/register/' + route);
				}
				else { console.log( err) };
		});
});


// register - step 3 : showing the selected user role signup

router.get('/user/auth/register/:id', registerAuth, function(req, res) {

		res.render ( 'app-explore/auth/register-user', {
				title: 'explore our app', bodyId: 'slackr-main-page', role: req.params.id, prev: '/user/auth/register/type',
				input: req.user.username, memberErr: req.query.error ? true : false, leaderErr: false
		});
});

// register - step 3: member signup to workspace ...

router.post('/user/auth/register/member', registerAuth, function ( req, res) {

			// first find the token by matching req token against token model.
			var tokenId = { token: req.body.token };

			var role_type = req.body.role_type;

	    // promise based user search ...
	    var promise = Tokens.findOne( tokenId ).exec();

	    promise.then( token => {
			  	 console.log( 'first ');
					 console.log( token );

					 if (token && token.claimed === false)  { console.log('is token and claimed'); }
					 if (!token || token.claimed === true)  { console.log('no token or token claimed'); }

					 if ( token && token.claimed === false ) {
				   	   console.log( 'token is valid' , token );

							 var userId     = String(req.user._id);
							 var newMember  = { userId: userId , space_role: role_type };

							 var stackQuery = { _id: token.space }

							 // use found token space id to find workspace and append user to members array ...
							 return Space.findByIdAndUpdate( stackQuery, { $push: { members: newMember } }, { new: true } );
				    }

					  if ( !token || token.claimed === true ) {
						   console.log('no token exists');
							 res.redirect('/user/auth/register/member?error=true');
							 return Promise.reject('token is invalid or has been claimed');
					  }
	    })
			.then( space => {

						console.log( 'second' );
						if (space) { console.log( space ) };

						// // update token to be claimed ...
						return Tokens.findOneAndUpdate( { token: req.body.token }, { claimed: true }, { new: true } );
      })
			.then( token  => {

						console.log( 'third' );

						const userId = { _id: req.user.id };

						User.findByIdAndUpdate( userId, { finished: true }, { new: true}, function (err, user) {

									if (!err && user) {
										console.log( 'found and updated user', user);
										res.redirect('/0/auth/workspaces');
									}
									else {console.log( err); }
						});
			})
    	.catch(err => {
      		// res.status(500).json({ error : err });
					console.log( err );
    	});
});


// register - step 3: leader signup payment options ...

router.post('/user/auth/register/leader', registerAuth, function ( req, res) {

	const userId = { _id: req.user.id };

	User.findByIdAndUpdate( userId, { finished: true }, { new: true}, function (err, user) {

				if (!err && user) {
					console.log( 'found and updated user', user);
				 	res.redirect('/0/auth/workspaces');
				}
				else if ( !user) {
					console.log( 'no user ');
				}
				else {
					console.log( 'what does this catch' );
				}
	});
});


// logout route process
router.get('/0/auth/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

module.exports = router;
