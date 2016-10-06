/**
 * Created by julia on 02.10.2016.
 */
var general = require('../utility/general');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var queueModel = require('../DB/queue');
var winston = logger.getT();
var cmd = 'queue';
var execute = function (message) {
    if (message.guild) {
        queueModel.findOne({server: message.guild.id}, function (err, Queue) {
            if (err) return console.log(err);
            if (Queue) {
                if (Queue.songs.length > 0) {
                    var reply = "";
                    for (var q = 0; q < Queue.songs.length; q++) {
                        if (q === 0) {
                            let dispatcher = voice.getDispatcher(message.guild.voiceConnection);
                            let repeat = Queue.repeat ? "repeat:on" : "";
                            if (typeof (Queue.songs[0].duration) !== 'undefined' && Queue.songs[0].duration !== '' && dispatcher) {
                                let time = Math.floor(dispatcher.time / 1000);
                                reply = reply + `Currently Playing:\` ${Queue.songs[0].title} ${repeat} ${general.convertSeconds(time)}/${Queue.songs[0].duration} \`\n`;
                            } else {
                                reply = reply + `Currently Playing:\`${Queue.songs[0].title} ${repeat}\`\n`;
                            }
                            if (Queue.songs.length > 1) {
                                reply = `${reply}Queued:\n\`\`\``;
                            }
                        } else {
                            let end = '\n';
                            if (q === Queue.songs.length - 1) {
                                end = `\`\`\``;
                            }
                            if (typeof (Queue.songs[q].duration) !== 'undefined') {
                                reply = reply + `${parseInt(q + 1)}. ${Queue.songs[q].title} ${Queue.songs[q].duration}${end}`;
                            } else {
                                reply = reply + `${parseInt(q + 1)}. ${Queue.songs[q].title}${end}`;
                            }
                        }

                    }
                    message.channel.sendMessage(reply).then(msg => {
                        msg.delete(60 * 1000);
                    }).catch(console.log);
                } else {
                    message.reply('There is no Song in the Queue right now!');
                }
            } else {
                message.reply('There is no Song in the Queue right now!');
            }
        });
    } else {
        message.reply('This Command does not work in private messages!');
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};