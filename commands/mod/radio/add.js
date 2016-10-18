/**
 * Created by julia on 18.10.2016.
 */
/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'add';
var songModel = require('../../../DB/song');
// var config = require('../../config/main.json');
var execute = function (message) {
    let messageSplit = message.content.split(' ').slice(3);
    let messageFormat = "";
    for (var i = 0; i < messageSplit.length; i++) {
        if (i === 0) {
            messageFormat = messageSplit[i];
        } else {
            messageFormat = messageFormat + " " + messageSplit[i];
        }
    }
    messageSplit = messageFormat.split('|');
    if (messageSplit.length > 0) {
        message.reply(JSON.stringify(messageSplit));
    } else {
        message.reply('Please add a Name and Stream for the Station');
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};