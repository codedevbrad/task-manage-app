
const mongoose = require('mongoose');

// board schema
const workspaceSchema = mongoose.Schema ({

 userId: { type: String,  },

});


// request schema
const notificationSchema = mongoose.Schema ({

 seen: { type: Boolean, default: false }

});

// member Schema
const memberSchema = mongoose.Schema ({

  email:    {  type: String,  required: true },
  username: {  type: String,  required: true },
  password: {  type: String,  required: true },
  teamRole: {  type: String,  default: 'leader' },
  workspace:     [ workspaceSchema ],
  notifications: [ notificationSchema ],

});


var User = module.exports = mongoose.model('user', memberSchema);
