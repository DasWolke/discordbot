/**
 * Created by julia on 05.09.2016.
 */
var userModel = require('../../../DB/user');
var login = require('./login');
var verify = function(discordId, proxerId) {
    console.log(discordId);
    console.log(proxerId);
    login();
};
module.exports = verify;