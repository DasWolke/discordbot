/**
 * Created by julia on 24.07.2016.
 */
var queueModel = require('../../../../DB/queue');
var remove = function removeFromQueue(bot, message, messageSplit) {
    if (typeof (messageSplit[2]) !== 'undefined') {
        if (messageSplit[2] === 'latest') {
            queueModel.findOne({server: message.server.id}, function (err, Queue) {
                if (err) return console.log(err);
                if (Queue) {
                    if (Queue.songs.length > 1) {
                        var length = Queue.songs.length;
                        var Song = Queue.songs[length-1];
                        Queue.removeLatest(function (err) {
                            if (err) return bot.reply(message, 'Internal Error!');
                            bot.reply(message, 'Successfully removed ' + Song.title);
                        });
                    } else if (Queue.songs.length === 1) {
                        bot.reply(message, 'Use !w.skip to skip the current Song!');
                    } else {
                        bot.reply(message, 'No Song in the Queue at the Moment!');
                    }
                } else {
                    bot.reply(message, 'No Song in the Queue at the Moment!');
                }
            });
        }
    }
};
module.exports = remove;