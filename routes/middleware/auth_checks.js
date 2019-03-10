
// package inludes
const express = require('express');
const path    = require('path');
const passport = require('passport');

module.exports.logged = function ( ) {

    return function( req, res, next) {

          // if user is auth & finished > return to route
          if   ( req.isAuthenticated() && req.user.finished == true) { return next();  }
          else { res.redirect( '/' );  }
    }
}

module.exports.spaceNew = function ( ) {

    return function( req, res, next) {

        if ( req.user.userIsnew  === false ) { return next(); }
        // user is new and has query ...
        else if ( req.user.userIsnew === true && req.query.completed ) { return next();  }
        // user is new and is shown guide page ...
        else if ( req.user.userIsnew === true && !req.query.completed ) { res.redirect('/0/workspaces/guide'); }
    }
}

module.exports.canCrud = function () {

}
