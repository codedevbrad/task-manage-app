const cryptoRandomString = require('crypto-random-string');
// basic node_modules
const express  = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const passport = require('passport');


module.exports.connect = function ( io ) {
      var connections = [];

      io.sockets.on('connection', function( socket ) {

           socket.on('connected', function (data) {
              console.log(data);
           });

            connections.push(socket);

            console.log('connection added', connections.length );

            socket.emit('testServer',  { msg: socket.Identity });

            socket.on('disconnect', function ( data ) {
                connections.splice( connections.indexOf( socket), 1 );
                console.log( ' sockets disconnected ');
            });
      });
}

// module.exports.socketTest = function () {
//     if ( userSocket !== 'undefined' || null) {
//       return userSocket.Identity;
//     }
//     else {
//       return 'socket has not been intitialised';
//     }
// }
//
// module.exports.socketPublish = function ( space, id) {
//     if ( userSocket !== 'undefined' || null) {
//        return userSocket;
//     }
//     else {
//       return 'socket has not been intitialised';
//     }
// }
//
// module.exports.spaceSockets = function () {
//     // return connections which are from the workspace ...
//     return 'sockets';
// }
