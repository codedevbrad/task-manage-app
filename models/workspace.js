
const mongoose = require('mongoose');


var stackSchema = mongoose.Schema ({
    stackID:    { type: String },
});

var membersSchema = mongoose.Schema ({
    space_role: { type: String  },
    userId:     { type: String  },
    isLogged:   { type: Boolean }
});

// each users category schema

var workspaceSchema = mongoose.Schema ({

    name:    { type: String },
    desc:    { type: String },

    ownerId: { type: String },
    members: [ ],

    stacks:   [ stackSchema ],
    channels: [ ]
});

var Workspaces = module.exports = mongoose.model('workspace', workspaceSchema );
