
// basic node_modules
const express  = require('express');
const router = express.Router();

const dirname = 'app-server/';

var Space  = require('../models/workspace');
var Stack  = require('../models/stack');
var Channel = require('../models/channel');

// check logged / protect routes ...
var checkAuth = function (req, res, next) {

    if   ( req.isAuthenticated() && req.user.finished == true ) {  return next(); }
    else { res.redirect('/'); }
};


// -----  aside loading animation get reqs ----- //

// get channels
router.get('/0/workspace/get/members', checkAuth, function(req, res) {
    res.send('members');
});

router.get('/0/workspace/get/channels', checkAuth, function(req, res) {
    res.send('channels');
});

router.get('/0/workspace/get/reminders', checkAuth, function(req, res) {
    res.send('reminders');
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
