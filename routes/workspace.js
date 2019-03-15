
// basic node_modules
const express  = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const path       = require('path');
const bodyParser = require('body-parser');

// image upload modules

const multer         = require('multer');
const GridFsStorage  = require('multer-gridfs-storage');
const Grid           = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto         = require('crypto');

const router = express.Router();

const dirname = 'app-server/';

// models
var User   = require('../models/user');
var Space  = require('../models/workspace');
var Stack  = require('../models/stack');
var Image  = require('../models/image');
var Tokens = require('../models/token');

router.use(methodOverride('_method'));

// authentication checks ...
var authChecks = require('./middleware/auth_checks');
var checkAuth  = authChecks.logged();
var checkSpace = authChecks.spaceNew();


// space check determine if guide or straight to space ...
var spaceAuthArr = [ checkAuth , checkSpace ];


// pusher connections
var socket = require('./middleware/pusherApi');
socket.connect();


// mongoLabs connection ...

const mlabconfig   = require('../config/mlab-db');
const conn = mongoose.createConnection(mlabconfig.database);

// check for db err
conn.on('error', function(err) { console.log(err); });

// init gfs
let gfs;

conn.once('open', () => { gfs = Grid(conn.db, mongoose.mongo); gfs.collection('uploads');  });


// Create storage engine
const storage = new GridFsStorage({
  url: mlabconfig.database,
  file: (req, file) => {
      return new Promise((resolve, reject) => {
          crypto.randomBytes(16, (err, buf) => {
              if (err) {  return reject(err);  }

              const filename = buf.toString('hex') + path.extname(file.originalname);
              const fileInfo = {  filename: filename,  bucketName: 'uploads'  };
              resolve(fileInfo);
          });
      });
  }
});

const upload = multer({ storage });


// show user a video guide on slackr
router.get( '/0/workspaces/guide', checkAuth , function( req, res ) {
    var Lead = req.user.teamIsLead;

    res.render(dirname + '/layout-includes/guide-confirm', {
        title: 'guide to slackr',
        displaymainlayout: false,
        isLead: Lead
    });
});

// show user a video on slackr
router.get( '/0/workspaces/guide/video', checkAuth , function( req, res ) {

    var Lead = req.user.teamIsLead;

    res.render(dirname + '/layout-includes/guide-tour', {
        title: 'guide to slackr',
        displaymainlayout: false,
        isLead: Lead
    });
});


// attach userId to socket
var user_hash = require('./middleware/cryptoModule');

router.get('/socket/required', checkAuth , function( req, res ) {
    res.send( user_hash.encrypt( req.user.username ) );
});


// workspace route ...

router.get('/0/auth/workspaces', spaceAuthArr , function(req, res) {

      var finshedGuide = req.query.completed;

      var promise = Space.find( { "members.userId": req.user.id } );

      promise.then(function( spaces ) {

          if ( finshedGuide ) {
              console.log( 'user has completed guide' );
              User.findByIdAndUpdate( { _id: req.user.id }, { userIsnew: false }, { new: true }, function( err , user) {
                  console.log( 'user has completed his intro video' );
              });
          }
          return spaces;
      })
      .then( spaces => {
          res.render(dirname + 'my-workspaces', {
              title: 'workspaces',
              spaces: spaces,
              displaymainlayout: false,
              spaceIsLead: req.user.teamIsLead
          });
      })
      .catch(function(err) {  console.log(err);  });
});


// get single workspace
router.get('/0/workspace/:id/' , spaceAuthArr , function(req, res) {

  var spacePeram = req.params.id;
  var spaceId    = { _id: spacePeram };

  // promise - search for workspace ...
  var promise = Space.findOne( spaceId ).exec();

  promise.then(function( workspace ) {

    var stackIds = [];
    var stackArr = workspace.stacks;

    // get stack id's owned by user ...

    stackArr.forEach(function( stack , index ) {
      stackIds.push( stack.stackID );
    });

    Stack.find({ _id: {$in: stackIds }}, function (err, stacks) {

        if (!err) {

            res.render(dirname + 'workspace', {
                // workspace
                title: workspace.name,
                displaymainlayout: true,

                // ids's
                space_id: spacePeram,
                data_id:  workspace._id,
                user_id: req.user._id,

                // workspace data
                desc:   workspace.desc,
                stacks: stacks,

                space_title: workspace.name,
                space_list:  [
                  { item: 'add members to stack',  link: 'space/add-members' },
                  { item: 'rename this workspace', link: 'space/rename'},
                  { item: 'remove from workspace', link: '/space/remove'}
                ],
            });
        }
        else { console.log( err ); }
    });
  })
  .catch(function(err) { console.log(err); });

});


// get workspace tokens ...

router.get('/0/workspace/:space/getAllTokens', checkAuth, function(req, res) {

    var query = { space: req.params.space , claimed: false };

    // promise based user search ...
    var promise = Tokens.find( query ).exec();

    promise.then(function( tokens ) {
        console.log( tokens );
        res.send( tokens );
    })
    .catch(function(err) {  console.log(err);  });
});


// generate token for workspace ...

router.get('/0/workspace/:space/genToken', checkAuth, function(req, res) {

      var space = req.params.space;

      crypto.randomBytes(16, (err, buf) => {
          if (!err) {

              var token = new Tokens();
              token.space = space;
              token.token = buf.toString('hex');

              token.save(function( err, key ) {
                  res.send( key );
              });
          }
      });
});


// new workspace

router.post('/0/auth/workspace-new', checkAuth, function(req, res) {

    var name = req.body.name;
    var desc = req.body.description;

    var space = new Space ({
      name: name, desc: desc, ownerId: req.user._id,  members: []
    });

    var userId = String(req.user._id);

    space.members.push( { userId: userId, space_role: 'leader'} );

    space.save(function( err, space ) {

      var sockets = socket.sockets();
      sockets[0].emit('testSocket',  { msg: 'i am cool' });
      res.send( { id: space._id } ).end();

    });
});


// --- get requests for content --- //

// stack page - get images
router.get('/0/workspace/stack/images/:id', checkAuth, function(req, res) {

  var stackQuery = req.params.id;

  // query image db for images containing stack id.
  var promise = Image.find( { StackId: stackQuery } ).exec();

  promise.then(function( images ) {

    if (images.length > 0) {

      var imgIds = [];

      images.forEach(function( img , index ) {
        imgIds.push( img.imageId );
      });

      gfs.files.find( { filename: {$in: imgIds }} ).toArray((err, files) => {
          if (!files || files.length === 0) {  }
          else {
               files.map(file => {
                 if ( file.contentType === 'image/jpeg' ||  file.contentType === 'image/png' ) { file.isImage = true; }
                 else { file.isImage = false;  }
               });
               // render content
               res.send( files );
          }
      });
    }
  }).catch(function(err) { console.log(err); });
});

// --- stack routes -- -//

// stack page - post new stack ...

router.post('/0/auth/workspace/stack/new/', checkAuth, function(req, res) {

  var val     = req.body.stackname;
  var des     = req.body.stackdesc;

  var spaceID = req.body.spaceID;

  var color = Math.floor((Math.random() * 8) + 1);

  var stack  = new Stack();
  stack.desc = des;  stack.ownerId = req.user._id;
  stack.name = val;  stack.spaceID = spaceID;
  stack.color  = color;

  stack.save(function( err, stack ) {

      var spaceUrl = stack.spaceID;

      var objPush = { stackID: stack._id };

      // stack has a space ID, match this to space collection ...
      Space.findByIdAndUpdate( { _id: spaceID }, { $push: { stacks: objPush } }, { new: true }, function( err, space ) {

          if ( err || space) { console.log( err || 'space not saved');  }
          if ( space )       { res.redirect('/0/workspace/' + spaceUrl );  }
      });
  });
});


// get single stack

router.get('/0/workspace/:space/stack/:id', checkAuth, function(req, res) {

      var spaceId = req.params.space;

      // promise - search for workspace ...
      var promise = Space.findOne( { _id: spaceId} ).exec();

      promise.then( function ( space ) {

          return Stack.findOne( { _id: req.params.id }).then(function ( stack ) {
                stack.spaceName = space.name;
                return stack;
          })
          .catch(function(err) { console.log(err) });
      })
      .then( function ( stack ) {
          res.render(dirname + 'stack', {
                 // workspace
                 space_title: stack.spaceName,
                 space_list:  [
                   { item: 'rename this stack', link: 'stack/rename' },
                   { item: 'remove me from this stack', link: 'stack/delete'}
                 ],
                 // stack
                 title:       stack.name,
                 data_id:     stack.id,
                 displaymainlayout: true,

                 // ids
                 space_id: spaceId,
                 stack_id: stack.id
           });
      })
      .catch(function(err) { console.log(err) });
});


// upload stack image  ...

router.post('/0/stack/:id/new', checkAuth, upload.single('file'), function(req, res) {

    var imgId = { _id: req.file.id }
    var stackId = req.params.id;

    // for now use mongodb ...
    var image  = new Image();
    image.imageId = req.file.filename;
    image.ownerId = req.user._id;
    image.StackId = req.params.id;

    image.save(function( err, image ) { res.redirect( req.get('referer'));  });
});


// @route GET /files/:filename
router.get('/files/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }
    // File exists
    return res.json(file);
  });
});

// @route GET /image/:filename
router.get('/image/:filename', (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({
        err: 'No file exists'
      });
    }

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Read output to browser
      const readstream = gfs.createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: 'Not an image'
      });
    }
  });
});


module.exports = router;


//
