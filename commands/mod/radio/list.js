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
    if (messageSplit.length > 0) {
        songModel.find({$text: {$search: messageFormat}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(5).exec(function (err, Songs) {
            if (err) return message.reply(err);
            message.reply(JSON.stringify(Songs));
        });
    } else {
        songModel.find({type: "radio"}, {score: {$meta: "textScore"}}).limit(10).exec(function (err, Songs) {
            if (err) return message.reply(err);
            message.reply(JSON.stringify(Songs));
        });
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};