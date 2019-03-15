const express  = require('express');
const router   = express.Router();
const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');
const passport = require('passport');

// models
var User  = require('../../models/user');



// practise export function

function getUsername ( value ) { return User.find( { });   };

router.get('/test/api/1', function( req, res) {

	  console.log('hit');

		function getUsers ( ) {

			  var user;

				var userErr = getUsername( );

			  userErr.exec(function( err, users ) {
						user = users[0];
				})
				.then(function() {
					console.log(user);
				})
		}

		var users = getUsers();
		res.end();
});

// testing throwing new Errors , res.status
   // youtube vid - netninja ...

router.get('/test/api/3', function( req, res) {

	// promise - search for workspace ...
	var promise = Space.findOne( { _id: req.params.space } ).exec();

	promise.then( function ( space ) {

				return Stack.findOne( { _id: req.params.id }).then(function ( stack ) {
							stack.spaceName = space.name;
							return stack;
				})
				.catch(function(err) { console.log(err) });
	})
	.then( function ( stack ) {

  		  console.log( space );
	})
	.catch(function(err) { console.log(err) });
});



///

module.exports = router;
