
const mongoose = require('mongoose');

var tokenSchema = mongoose.Schema ({

    space:   { type: String },
    claimed: { type: Boolean, default: false },
    token:   { type: String }
});

var Stack = module.exports = mongoose.model('token', tokenSchema);
