/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'ytq';
var yt = require('../utility/youtube/youtube');
var ytHelper = require('../utility/youtube/helper');
var execute = function (message) {
    if (message.guild) {
        yt.search(message, function (err, Result) {
            if (err) {
                message.reply(err);
            } else {
                ytHelper.ytDlAndQueue(message, Result.link, ['lel', Result.link]);
            }
        });
    } else {
        message.reply('This command does not work in private messages!');
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};