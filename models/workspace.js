
const mongoose = require('mongoose');

var stackSchema = mongoose.Schema ({

    stackID:   { type: String }
});

// each users category schema

var workspaceSchema = mongoose.Schema ({

    name:    { type: String },
    desc:    { type: String },
    ownerId: { type: String },
    spaceID: { type: String },

    stacks:   [ stackSchema ],
    channels: [ ],
    members:  [ ]

});

var Workspaces = module.exports = mongoose.model('workspace', workspaceSchema);

// post request   ...

// update request ...

// delete request ...
