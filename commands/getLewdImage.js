/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'lewd';
var lewd = require('../config/lewd.json');
var generalHelper = require('../utility/general');
var execute = function (message) {
    let number = generalHelper.random(0, lewd.images.length-1);
    message.channel.sendFile(lewd.images[number]);
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};