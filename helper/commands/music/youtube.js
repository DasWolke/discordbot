/**
 * Created by julia on 24.07.2016.
 */
var yt = require('../../youtube/youtube');
var ytHelper = require('../../youtube/helper');
var youtube = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.yt":
            if (typeof (messageSplit[1]) !== 'undefined') {
                bot.reply(message, 'Started Downloading Video');
                yt.download(messageSplit[1], message, function (err, info) {
                    if (err) {
                        console.log(err);
                        return bot.reply(message, 'This is not a Valid Url, maybe the Song is too long or is blocked!');
                    }
                    bot.reply(message, 'Finished Downloading ' + info.title);
                });
            } else {
                bot.reply(message, "No YT Link found!");
            }
            return;
        case "!w.yt.s":
            yt.search(message, function (err, Result) {
                if (err) {
                    bot.reply(message, err);
                } else {
                    bot.reply(message, 'Found the Following Song ' + Result.link);
                }
            });
            return;
        case "!w.yt.sq":
            yt.search(message, function (err, Result) {
                if (err) {
                    bot.reply(message, err);
                } else {
                    ytHelper.ytDlAndQueue(bot, message, Result.link, ['lel',Result.link]);
                }
            });
            return;
        default:
            return;
    }
};
module.exports = youtube;