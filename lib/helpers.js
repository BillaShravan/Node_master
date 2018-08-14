/**
 * helpers for various taks
 */
let crypto = require('crypto');
let config = require('./config');
let helpers = {};

//create SHA256 hash
helpers.hash = function(str) {
    if(typeof str === 'string' && str.length >0){
        let hash = crypto.createHmac('sha256',config.hashSecret).update(str).digest('hex');
        return hash;
    }else{
        return false;
    }
};

helpers.parseToJsonObject = function(str) {
    try{
        let obj = JSON.parse(str);
        return obj;
    }catch(e){
        return {};
    }
}


module.exports = helpers;