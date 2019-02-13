const mongoose = require('mongoose');


var stackSchema = mongoose.Schema ({

    name:    { type: String },
    desc:    { type: String },
    ownerId: { type: String },
    spaceID: { type: String },
    color:   { type: String }
});

var Stack = module.exports = mongoose.model('stack', stackSchema);
