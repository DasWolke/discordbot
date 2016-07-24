/**
 * Created by julia on 24.07.2016.
 */
var messageHelper = require('../../../utility/message');
var ytHelper = require('../../../youtube/helper');
var songModel = require('../../../../DB/song');
var voice = require('../../../utility/voice');
var YoutubeReg = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)(&.*|)/g;
var add = function addToQueue(bot,message,messageSplit) {
    var messageSearch = "";
    for (var a = 2; a < messageSplit.length; a++) {
        messageSearch = messageSearch + " " + messageSplit[a]
    }
    console.log(messageSearch);
    if (messageSplit[1].match(YoutubeReg)) {
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