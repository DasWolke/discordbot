/**
 * Created by julia on 24.07.2016.
 */
var queueModel = require('../../../../DB/queue');
var remove = function removeFromQueue(message, messageSplit) {
    if (typeof (messageSplit[2]) !== 'undefined') {
        if (messageSplit[2] === 'latest') {
            queueModel.findOne({server: message.guild.id}, function (err, Queue) {
                if (err) return console.log(err);
                if (Queue) {
                    if (Queue.songs.length > 1) {
                        var length = Queue.songs.length;
                        var Song = Queue.songs[length-1];
                        Queue.removeLatest(function (err) {
                            if (err) return message.reply('Internal Error!');
                            message.reply('Successfully removed ' + Song.title);
                        });
                    } else if (Queue.songs.length === 1) {
                        message.reply('Use !w.skip to skip the current Song!');
                    } else {
                        message.reply('No Song in the Queue at the Moment!');
                    }
                } else {
                    message.reply('No Song in the Queue at the Moment!');
                }
            });
        }
    } else {
        if (messageSplit[0] === '!w.qrl') {
            queueModel.findOne({server: message.guild.id}, function (err, Queue) {
                if (err) return console.log(err);
                if (Queue) {
                    if (Queue.songs.length > 1) {
                        var length = Queue.songs.length;
                        var Song = Queue.songs[length-1];
                        Queue.removeLatest(function (err) {
                            if (err) return message.reply('Internal Error!');
                            message.reply('Successfully removed ' + Song.title);
                        });
                    } else if (Queue.songs.length === 1) {
                        message.reply('Use !w.skip to skip the current Song!');
                    } else {
                        message.reply('No Song in the Queue at the Moment!');
                    }
                } else {
                    message.reply('No Song in the Queue at the Moment!');
                }
            });
        }
    }
};
module.exports = remove;