
const mongoose = require('mongoose');

var vitalChanneldata = mongoose.Schema ({

    name:   { type: String },
    leader: { type: String }
});

var chatSchemma = mongoose.Schema ({

    user: { type: String },
    msg:  { type: String }
});

// each users category schema

var channelSchema = mongoose.Schema ({

    vitalData: [ vitalChanneldata ],
    members:   [  ],
    chatData:  [ chatSchemma ]
});

var ChatBubble = module.exports = mongoose.model('chatBubble', channelSchema );
