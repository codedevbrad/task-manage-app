
const crypto = require('crypto');

var cryptoKey = require('../../config/crypto.js');

module.exports.encrypt = function ( text  ) {
    var cipher  = crypto.createCipher( cryptoKey.algorithm , cryptoKey.password );
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
}

module.exports.decrypt = function ( text ) {
    var decipher = crypto.createDecipher( cryptoKey.algorithm , cryptoKey.password );
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
}
