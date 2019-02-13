
// basic node_modules
const express  = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const path    = require('path');
const bodyParser = require('body-parser');

// image upload modules

const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');
const crypto = require('crypto');

const router   = express.Router();

const dirname = 'app-server/';

// models
var User   = require('../models/user');
var Space  = require('../models/workspace');
var Stack  = require('../models/stack');
var Image  = require('../models/image');
var Tokens = require('../models/token');


router.use(methodOverride('_method'));

// check logged / protect routes ...
var checkAuth = function (req, res, next) {

    if   ( req.isAuthenticated() && req.user.finished == true ) {  return next(); }
    else { res.redirect('/');     }
};

// mongoLabs connection

const mlabconfig   = require('../config/mlab-db');
const conn = mongoose.createConnection(mlabconfig.database);

// check for db err
conn.on('error', function(err) { console.log(err); });

// init gfs
let gfs;

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});


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


// workspace route

router.get('/0/auth/workspaces', checkAuth, function(req, res) {

      var query = { userId: req.user.id };

      // search user id against ownerId / else search user id against member array
      var promise = Space.find( { members: query }).exec();

      promise.then(function( workspaces) {

             console.log( workspaces );

              res.render(dirname + 'my-workspaces', {
                  title: 'workspaces',
                  spaces: workspaces,
                  displaymainlayout: false
              });

      })
      .catch(function(err) {  console.log(err);  });
});


// get workspace tokens ...

router.get('/0/workspace/:space/getAllTokens', checkAuth, function(req, res) {

    var space = { space: req.params.space };

    // promise based user search ...
    var promise = Tokens.find( space ).exec();

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

    space.members.push( { userId: userId } );

    space.save(function( err, space ) {
      res.send( { id: space._id } ).end();
    });
});


// get single workspace

router.get('/0/workspace/:id/', checkAuth, function(req, res) {

  var space = { _id: req.params.id };

  // promise - search for workspace ...
  var promise = Space.findOne( space ).exec();

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
                title: workspace.name,
                displaymainlayout: true,
                data_id: workspace._id,

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

// create new stack ...

router.post('/0/auth/workspace/stack/new/', checkAuth, function(req, res) {

  var val     = req.body.stackname;
  var des     = req.body.stackdesc;
  var spaceID = req.body.spaceID;

  var color = Math.floor((Math.random() * 8) + 1);

  var stack  = new Stack();
  stack.name = val;
  stack.desc = des;
  stack.ownerId = req.user._id;
  stack.spaceID = spaceID;
  stack.color   = color;

  stack.save(function( err, stack ) {
      saveToWorkspace( stack );
  });

  function saveToWorkspace( stack ) {

    var workspaceID = { _id: stack.spaceID };

    // stack has a space ID, match this to space collection ...
    var promise = Space.findOne( workspaceID ).exec();

    promise.then(function (space) {

        var array = space.stacks;
        var obj   = { stackID: stack._id, }

        array.push(obj);

        Space.update( workspaceID, space, function(err) {
            if (err) { console.log(err);  }
            else     { res.redirect('/')  }
        });
    })
    .catch(function(err) { });
  }
});


// get single stack

router.get('/0/workspace/stack/:id', checkAuth, function(req, res) {

    // stack id to identify the space owned by
    var stackId = { _id: req.params.id };

    // search the Stack model
    var promise = Stack.findOne( stackId ).exec();

    promise.then(function ( stack ) {
        // render stack ..
        res.render(dirname + 'stack', {

            title:       stack.name,
            space_title: stack.name,
            data_id:     stack.id,

            space_list:  [
              { item: 'rename this stack', link: 'stack/rename' },
              { item: 'remove me from this stack', link: 'stack/delete'}
            ],
            displaymainlayout: true
        });

    })
    .catch(function(err) { console.log('no stack found'); });
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

    image.save(function( err, image ) {
      res.redirect('/0/auth/workspaces');
    });
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
