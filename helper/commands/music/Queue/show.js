/**
 * Created by julia on 24.07.2016.
 */
var general = require('../../../utility/general');
var voice = require('../../../utility/voice');
var queueModel = require('../../../../DB/queue');
var show = function showQueueCmd(bot,message) {
    queueModel.findOne({server: message.guild.id}, function (err, Queue) {
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
                message.reply(reply).then(msg => {
                    msg.delete(60*1000);
                }).catch(console.log);
            } else {
                message.reply('There is no Song in the Queue right now!');
            }
        } else {
            message.reply('There is no Song in the Queue right now!');
        }
    });
};
module.exports = show;