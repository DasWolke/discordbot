/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'rem';
var lewd = require('../config/lewd.json');
var path = require('path');
var generalHelper = require('../utility/general');
var execute = function (message) {
    //TODO remove when fixed
    let number = generalHelper.random(0, lewd.rem.length-1);
    message.channel.sendFile(path.join(__dirname, '../remImages/' + lewd.rem[number]), '', '\u200B').then(message => {

    }).catch(console.log);
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};