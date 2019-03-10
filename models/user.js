
const mongoose = require('mongoose');


// request schema
const notificationSchema = mongoose.Schema ({

  space: { type: String,  required: true },
  seen:  { type: Boolean, default: false },
  msg:   { type: String,  required: true }
});

// member Schema
const memberSchema = mongoose.Schema ({

  email:    {  type: String,  required: true },
  username: {  type: String,  required: true },
  password: {  type: String,  required: true },

  teamIsLead: { type: Boolean, default: false },
  finished:   { type: Boolean, default: false },
  userIsnew:  { type: Boolean, default: true  },

  notifications: [ notificationSchema ],
});


var User = module.exports = mongoose.model('user', memberSchema);
