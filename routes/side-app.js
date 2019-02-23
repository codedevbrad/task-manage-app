
// basic node_modules
const express  = require('express');
const router = express.Router();

const dirname = 'app-server/';

var User   = require('../models/user.js');
var Space  = require('../models/workspace');
var Stack  = require('../models/stack');
var Channel = require('../models/channel');


// check logged / protect routes ...
var checkAuth = function (req, res, next) {

    if   ( req.isAuthenticated() && req.user.finished == true ) {  return next(); }
    else { res.redirect('/'); }
};

// -----  aside loading animation get reqs ----- //

// get members of workspace ...
router.get('/0/workspace/:id/get/members', checkAuth, function( req, res ) {

    var promise = Space.findById( { _id: req.params.id }).exec();

    var usersArr = [];

    promise.then( function( space ) {

        var userIdsClean = [];
        var memberIdsStrip = space.members;

        memberIdsStrip.forEach(function( user , index ) {
            userIdsClean.push( user.userId );
            usersArr.push( { role: user.space_role } );
        });

        return userIdsClean;
    })
    .then( array => {

        return User.find( { _id: { $in: array } }).then(function ( users ) {

            users.forEach( function( user , index ) {
                usersArr[ index ].username = user.username;
            });

            return usersArr;

        })
        .catch(function(err) { console.log(err) });

    })
    .then( users => {
          res.send( users );
    })
    .catch(function(err) { console.log( err ); });
});


router.get('/0/workspace/:space/get/channels', checkAuth, function(req, res) {

     var spaceId = req.params.space;

     var promise = Space.findById( { _id: spaceId }).exec();

     promise.then( function( space ) {

          var channels = space.channels;

          // should i .map or .forEach ?
          var ids = channels.map( function ( { id } ) {
              return id;
          });

          console.log('channels' , ids );
          return ids;
     })
     .then( channelIds => {

          Channel.find( { _id: { $in: channelIds }} , function( err , channels ) {

             console.log( channels );

             if ( !err && channels ) {

                 var channelArr = [];
                 channels.forEach( function ( channel , index ) {

                    var id = channel._id;
                    channelArr.push( { name: channel.channelName , tag: channel.channelTag , url: id } );
                 });
                 res.send( channelArr );
             }
          });
     })
     .catch(function(err) { console.log( err ); });

});

router.get('/0/workspace/:id/get/reminders', checkAuth, function(req, res) {
    res.send('reminders');
});


// get workspace channel single

router.get('/0/workspace/:space/channel/:cId', checkAuth, function(req, res) {

    var spaceId = req.params.space;
    var cId     = req.params.channel;

    // search and find chnnnel ...
    res.render(dirname + 'channels', {

      // id's
      data_id:  spaceId,
      space_id: spaceId,

      channel:  'channel array',

      title: 'channel: lunch ideas', // app title
      space_title: 'house designs', // workspace title
      displaymainlayout: true
    });
});

// workspace channel new

router.post('/0/workspace/:space/channel-new', checkAuth, function(req, res) {
      var work = req.params.space;

      // post data
      var title = req.body.channelName;
      var tag   = req.body.channelTag;

      console.log( work , title , tag );
      var channel = new Channel();
      channel.channelName = title;
      channel.channelTag  = tag;
      channel.joinedMembers = [ ];
      channel.chatData = [ ];

      var channelLeader = String( req.user._id );
      channel.joinedMembers.push( channelLeader );

      channel.save( function ( err , channel ) {

            var id = String(channel._id);

            var channelObj = { id };

            Space.findByIdAndUpdate( { _id: work } , { $push: { channels: channelObj } }, function( err , space) {
                console.log( space );
                res.redirect( req.get('referer'));
            });
      });
});

// post channel message



module.exports = router;
