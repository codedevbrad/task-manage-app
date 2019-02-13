
const mongoose = require('mongoose');

var stackSchema = mongoose.Schema ({
    stackID: { type: String }
});

// each users category schema

var workspaceSchema = mongoose.Schema ({

    name:    { type: String },
    desc:    { type: String },

    ownerId: { type: String },
    members:  [ ],

    stacks:   [ stackSchema ],
    channels: [ ]

});

var Workspaces = module.exports = mongoose.model('workspace', workspaceSchema );
