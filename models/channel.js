
const mongoose = require('mongoose');

// channel important

var dataSchema = mongoose.Schema ({
    channelName:   { type: String , required: true },
    channelTag:    { type: String , requires: true },
});

// chat messages ...

var chatSchemma = mongoose.Schema ({

    user:   { type: String  },
    msg:    { type: String  },
    posted: { type: String  }
});

// each users category schema ...

var channelSchema = mongoose.Schema ({

    channelData:   [ dataSchema ],

    channelName:   { type: String , required: true },
    channelTag:    { type: String , requires: true },
    joinedMembers: [ ],
    chatData:      [ chatSchemma ]
});

var Channel = module.exports = mongoose.model('channel', channelSchema );
