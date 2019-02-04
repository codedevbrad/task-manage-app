
// basic node_modules
const express  = require('express');
const router = express.Router();

const dirname = 'app-server/';

var Space  = require('../models/workspace');
var Stack  = require('../models/stack');


// check logged / protect routes ...
var checkAuth = function (req, res, next) {

    if   ( req.isAuthenticated() && req.user.finished == true ) {  return next(); }
    else { res.redirect('/'); }
};

function getWorkspaceData ( request ) {

  var promise = Space.find( request ).exec();

  promise.then(function ( data ) {
      return true
  })
  .catch(function(err) { return false });
}

// -----  aside loading animation get reqs ----- //

// get channels
router.get('/0/workspace/get/data/1', checkAuth, function(req, res) {
   console.log(getWorkspaceData());
   res.send( 'getting data' );
});

// get members
router.get('/0/workspace/get/data/2', checkAuth, function(req, res) {
   res.send( 'getting data' );
});


// workspace channel single

router.get('/0/workspace/channel/id', checkAuth, function(req, res) {
    res.render(dirname + 'channels', {
      data_id: 'workspace', //
      title: 'channel: lunch ideas', // app title
      space_title: 'house designs', // workspace title
      displaymainlayout: true
    });
});

// workspace channel new

router.post('/0/workspace/:channel/', checkAuth, function(req, res) {
      var user = req.user;
      var chan = req.params.channel;
      var work = req.body.workspace;
});

// post channel message



module.exports = router;
