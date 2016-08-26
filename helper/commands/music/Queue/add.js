/**
 * Created by julia on 24.07.2016.
 */
var messageHelper = require('../../../utility/message');
var ytHelper = require('../../../youtube/helper');
var songModel = require('../../../../DB/song');
var voice = require('../../../utility/voice');
var add = function addToQueue(bot,message,messageSplit) {
    if (typeof(messageSplit[1]) === 'undefined') {
        return bot.reply(message, 'You did not enter a search Term!');
    }
    var messageSearch = "";
    var a = 0;
    if (messageSplit[1] === 'add' && typeof (messageSplit[2]) !== 'undefined') {
        for (a = 2; a < messageSplit.length; a++) {
            messageSearch = messageSearch + " " + messageSplit[a]
        }
    } else {
        for (a = 1; a < messageSplit.length; a++) {
            messageSearch = messageSearch + " " + messageSplit[a]
        }
    }
    if (voice.checkMedia(messageSplit[1]) || typeof (messageSplit[2]) !== 'undefined' && voice.checkMedia(messageSplit[2])) {
        ytHelper.ytDlAndQueue(bot, message, messageSearch, messageSplit);
    } else {
        songModel.find({$text: {$search: messageSearch}},{score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec(function (err, Songs) {
            if (err) return console.log(err);
            if (Songs !== null && Songs.length > 0) {
                voice.addToQueue(bot, message, Songs[0]);
            } else {
                bot.reply(message, 'No Song found with Search Term `' + messageHelper.cleanMessage(messageSearch) + '`');
            }
        });
    }
};
module.exports = add;