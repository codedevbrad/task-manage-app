const express  = require('express');
const router   = express.Router();
const mongoose   = require('mongoose');
mongoose.Promise = require('bluebird');
const passport = require('passport');

// models
var User  = require('../models/user');


function getUsername ( value ) {
	  	return User.findOne( { username: value } );

			// return Stack.findOne( { _id: req.params.id }).then(function ( stack ) {
			// 			stack.spaceName = space.name;
			// 			return stack;
			// })
			// .catch(function(err) { console.log(err) });
};

router.get('/test/api/1', function( req, res) {

		function checkError( username ) {

				var errors = [];

				var userErr = getUsername( username );

				userErr.exec(function( err, user) {

					 if (err)  { console.log ( err); }
					 if (user) { errors.push( { param: 'username', msg: '!taken', value: username }); }
				});

				return errors;
		}

		if (checkError( 'devcode' )) {
				console.log( 'errors' );
		}
		else { console.log( 'no errors') };

});

//

router.get('/test/api/2', function( req, res) {

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
