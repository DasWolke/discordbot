/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'yts';
var yt = require('../utility/youtube/youtube');
var execute = function (message) {
    yt.search(message, function (err, Result) {
        if (err) {
            message.reply(err);
        } else {
            message.reply('Found the Following Song ' + Result.link);
        }
    });
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};