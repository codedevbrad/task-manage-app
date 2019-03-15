
// basic node_modules
var server   = require('../../server.js').serverExport();
var io       = require('socket.io')( server );
var hash     = require('./cryptoModule');


const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var Channels = require('../../models/channel');

var connections = [];

// connectionIsActive = client should know all members active in a space
// connectionState    = all members should be notified of a client connection to space

module.exports.connect = function () {
    io.sockets.on('connection', function( socket ) {
        var roomId = null;

        connections.push( socket );
        console.log('connection added', connections.length);

        // connect only when joining a workspace ...
        socket.on('connected', function ( data ) {
           // add id's to socket
           socket.handshake_username = hash.decrypt(data.needed);
           socket.handshake_space    = data.spaceId;

           roomId = JSON.stringify( data.spaceId );

           // create a workspace room ...
           if (data.spaceId !== null ) {
                // user joins room with id of data.spaceId
                socket.join( roomId );

                pusher.usernames( data.spaceId, function ( users ) {
                    // show socket all active members in space ...
                    socket.emit('connectionIsActive', { class: 'isLogged', logged: users } );
                    // emit to group that socket has connected to a space ...
                    io.in( roomId ).emit('connectionState', { class: 'isLogged', user: socket.handshake_username });
                });
           }
        });

        socket.on('channel-message', function ( data ) {

            var id = { _id: data.channel };
            var objPush = { user: socket.handshake_username, msg: data.msg };

            // add message to channel db collection
            var promise = Channels.findByIdAndUpdate( id, { $push: { chatData: objPush } }, { new: true });

            promise.then( function( channel ) {
               console.log( channel );
               if (!channel) {  }
               return true;
            })
            .then( function ( ) {
               io.in( socket.handshake_space ).emit('memberMsg', { user: socket.handshake_username , msg: data.msg } );
            })
            .catch(function(err) {  console.log(err);  });
        });

        socket.on('disconnect', function ( data ) {
            // disconnect ...
            connections.splice( connections.indexOf( socket ), 1);
            console.log( 'sockets disconnected', connections.length);

            // emit to users that socket is disconected ...
            io.in( roomId ).emit('connectionState', { class: '', user: socket.handshake_username });
        });
    });
}

// return all socket connections
module.exports.sockets = function () {
   return connections;
}

// auth checks to test if socket is in space
var roomChecks = function () {
    return {
    }
}

var pusher = function () {
     return {
        // emit to a single socket ...
        socket: function( username , space , next ) {
            var found = connections.find(function( socket ) {
               return socket.handshake_username === username && socket.handshake_space === space ;
            });
            if (found) { next( found ) }
            else       { console.log( 'no socket exists in space'); }
        },

        // get all usernames in a space ...
        usernames: function( space , next ) {

            var sockets = connections.filter( function ( each ) {
                return each.handshake_space === space;
            })
            .map( function( { handshake_username } ) { return handshake_username; });

            if ( sockets.length > 0 ) { next( sockets ); }
            else                      { console.log( 'no active members'); }
        },

        // emit to all usernames in a space ...
        sockets: function( space , emit ) {

            var sockets = connections.filter( function ( each ) {
                return each.space_id == space;
            });

            if ( sockets.length > 0 ) { emit( sockets ); }
        }
     }
}();

module.exports.pusher = pusher;

/*
    pusher.socket('john', '1234', function ( socket ) {
        		console.log( 'socket.emit( { identifier}, msgName ); ' , socket );
    });

    pusher.usernames( '1234', function ( users ) {
    	 			console.log( 'users active in space: ' , users );
    });

    pusher.sockets( '1234', function ( sockets ) {
        sockets.forEach( function( socket ) {
        		console.log( 'each user in space: ' , socket );
        });
    });
*/
