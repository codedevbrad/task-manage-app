
const mongoose = require('mongoose');

// chat messages ...

var chatSchemma = mongoose.Schema ({

    user:   { type: String  },
    msg:    { type: String  },
});

// each users category schema ...

var channelSchema = mongoose.Schema ({

    channelName:   { type: String , required: true },
    channelTag:    { type: String , required: true },
    created_by:    { type: String , required: true },
    chatData:      [ chatSchemma  ]
});

var Channel = module.exports = mongoose.model('channel', channelSchema );
