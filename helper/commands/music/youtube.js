/**
 * Created by julia on 24.07.2016.
 */
var yt = require('../../youtube/youtube');
var ytHelper = require('../../youtube/helper');
var youtube = function (bot, message) {
    var messageSplit = message.content.split(' ');
    switch (messageSplit[0]) {
        case "!w.yt":
            if (message.guild) {
                if (typeof (messageSplit[1]) !== 'undefined') {
                    message.reply('Started Downloading Video');
                    yt.download(messageSplit[1], message, function (err, info) {
                        if (err) {
                            console.log(err);
                            return message.reply('This is not a Valid Url, maybe the Song is too long or is blocked!');
                        }
                        message.reply('Finished Downloading ' + info.title);
                    });
                } else {
                    message.reply("No YT Link found!");
                }
            }
            return;
        case "!w.yts":
                yt.search(message, function (err, Result) {
                    if (err) {
                        message.reply(err);
                    } else {
                        message.reply('Found the Following Song ' + Result.link);
                    }
                });
            return;
        case "!w.ytq":
            if (message.guild) {
                yt.search(message, function (err, Result) {
                    if (err) {
                        message.reply(err);
                    } else {
                        ytHelper.ytDlAndQueue(bot, message, Result.link, ['lel', Result.link]);
                    }
                });
            }
            return;
        default:
            return;
    }
};
module.exports = youtube;