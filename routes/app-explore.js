const express  = require('express');
const router   = express.Router();


function checkuser(req, res, next) {
    if (req.isAuthenticated()) { res.redirect('/0/auth/workspaces');  }
    else          { next();    }
}

const dirname = 'app-explore/auth';


router.get('/', checkuser, function(req, res) {

    res.render ('app-explore/index', { title: 'explore our app'
    });
});


router.get('/get-started',  checkuser,  function(req, res) {

    res.render (dirname+'/get-started', {
      title: 'explore our app', bodyId: 'slackr-main-page'
    });
});

router.get('/login', checkuser, function(req, res) {

    res.render (dirname+'/login', {
      title: 'explore our app', bodyId: 'slackr-main-page'
    });
});



module.exports = router;
