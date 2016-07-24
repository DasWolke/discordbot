/**
 * Created by julia on 24.07.2016.
 */
var general = require('../../../utility/general');
var voice = require('../../../utility/voice');
var queueModel = require('../../../../DB/queue');
var show = function showQueueCmd(bot,message) {
    queueModel.findOne({server: message.server.id}, function (err, Queue) {
        if (err) return console.log(err);
        if (Queue) {
            if (Queue.songs.length > 0) {
                var reply = "The Following Songs are in the Queue right now:\n\n";
                for (var q = 0; q < Queue.songs.length; q++) {
                    if (q === 0) {
                        reply = reply + "Now Playing: ```" + Queue.songs[q].title + " Time:" + general.convertSeconds(voice.getSongDuration()) + "```";
                    } else {
                        reply = reply + parseInt(q + 1) + ": ```" + Queue.songs[q].title + "```";
                    }
                }
                bot.reply(message, reply, function (err,messageReply) {
                    if (err) return console.log(err);
                    var timeOut = setTimeout(function () {
                        bot.deleteMessage(messageReply);
                    }, 1000*60);
                });
            } else {
                bot.reply(message, 'There is no Song in the Queue right now!');
            }
        } else {
            bot.reply(message, 'There is no Song in the Queue right now!');
        }
    });
};
module.exports = show;