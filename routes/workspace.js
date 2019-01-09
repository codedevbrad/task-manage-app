
const express  = require('express');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const router   = express.Router();

// models
var User   = require('../models/user');
var Space  = require('../models/workspace');
var Stack  = require('../models/stack');


// check logged / protect routes ...
var checkAuth = function (req, res, next) {

    if   ( req.isAuthenticated()) {  return next(); }
    else { res.redirect('/');     }
};

const dirname = 'app-server/';


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

  // promise based user search ...
  var promise = Space.findOne( space ).exec();

  promise.then(function( workspace ) {

    res.render(dirname + 'workspace', {
        title: workspace.name,
        space: workspace,
        displaymainlayout: true,
        data_id: workspace._id,

        space_title: workspace.name,
        space_list:  [
          { item: 'add members to stack',  link: 'space/add-members' },
          { item: 'rename this workspace', link: 'space/rename'},
          { item: 'remove from workspace', link: '/space/remove'}
        ],
    });
  })
  .catch(function(err) { console.log(err); });
});


// load stack data ...

router.get('/0/workspace/get/data', checkAuth, function(req, res) {
    // get staxks ...

});


// create new stack ...

router.post('/0/auth/workspace/stack/new/', checkAuth, function(req, res) {

  var val     = req.body.stackname;
  var des     = req.body.stackdesc;
  var spaceID = req.body.stackID;

  var stack = new Stack();
  stack.name = val;
  stack.desc = des;
  stack.ownerId = req.user._id;
  stack.spaceID = spaceID;

  stack.save(function( err, stack ) {
      saveToWorkspace( stack );
  });

  function saveToWorkspace( stack ) {

    var workspaceID = { _id: stack.spaceID };

    // stack has a space ID, match this to space collection ...
    var promise = Space.findOne( workspaceID ).exec();

    promise.then(function (space) {

        var color = Math.floor((Math.random() * 8) + 1);

        var array = space.stacks;
        var obj   = { stackID: stack._id, stackName: stack.name, color: color }

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

  // find stack in stack collection ...

    // render stack ..
    res.render(dirname + 'stack', {

        space_title: 'Pinterest clone',
        space_list:  [
          { item: 'rename this stack', link: 'stack/rename' },
          { item: 'remove me from this stack', link: 'stack/delete'}
        ],
        displaymainlayout: true
    });
});



module.exports = router;

//
