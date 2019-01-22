const mongoose = require('mongoose');

var imageSchema = mongoose.Schema ({

    imageId: { type: String },
    ownerId: { type: String },
    StackId: { type: String }

});

var Image = module.exports = mongoose.model('image', imageSchema);
