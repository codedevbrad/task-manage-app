
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

  // promise based user search ...
  var promise = Space.find( { ownerId: req.user._id }).exec();

  promise.then(function(workspaces) {

    res.render(dirname + 'my-workspaces', {
        title: 'workspaces',
        spaces: workspaces,
        displaymainlayout: false
    });
  })
  .catch(function(err) {  console.log(err);  });
});


// new workspace

router.post('/0/auth/workspace-new', checkAuth, function(req, res) {

  var name = req.body.name;
  var desc = req.body.description;
  var id   = req.body.data_id;

  var space = new Space ({
    name: name, desc: desc, ownerId: req.user._id, spaceID: id
  });

  space.save(function(err) { res.end();  });
});


// get single workspace

router.get('/0/workspace/:id/', checkAuth, function(req, res) {

  var space = { _id: req.params.id };

  // promise - search for workspace ...
  var promise = Space.findOne( space ).exec();

  promise.then(function( workspace ) {

    var stackIds = [];

    var stackArr = workspace.stacks;

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
    });
  })
  .catch(function(err) { console.log(err); });

});

// --- get requests for content --- //

// stack page - get images
router.get('/0/workspace/get/stack/images', checkAuth, function(req, res) {
  gfs.files.find().toArray((err, files) => {

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

            // images: images,

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
  console.log(req.file);

  // for now use mongodb ...
  var image  = new Image();
  image.imageId = req.file.id;
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
