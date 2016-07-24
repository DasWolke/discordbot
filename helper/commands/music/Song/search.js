/**
 * Created by julia on 24.07.2016.
 */
var songModel = require('../../../../DB/song');
var messageHelper = require('../../../utility/message');
var searchCmd = function searchCmd(bot,message,messageSplit) {
    if (typeof (messageSplit[1]) !== 'undefined') {
        var messageSearch = "";
        for (var c = 1; c < messageSplit.length; c++) {
            messageSearch = messageSearch + " " + messageSplit[c]
        }
        songModel.find({$text: {$search: messageSearch}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(5).exec(function (err, Songs) {
            if (err) return console.log(err);
            if (Songs !== null && Songs.length > 0) {
                var reply = "Found the following Songs:\n\n";
                for (var x = 0; x < Songs.length; x++) {
                    reply = reply + parseInt(x + 1) + ": ```" + Songs[x].title + "```\n\n";
                }
                bot.reply(message, reply);
            } else {
                bot.reply(message, "No Songs found with Search Term " + messageHelper.cleanMessage(messageSearch));
            }
        });
    } else {
        bot.reply(message, "No Search Term entered!");
    }
};
module.exports = searchCmd;