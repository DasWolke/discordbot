/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var osu = require('../utility/osu');
var winston = logger.getT();
var cmd = 'skip';
var queueModel = require('../DB/queue');
var config = require('../config/main.json')
var execute = function (message) {
    if (message.guild) {
        if (voice.inVoice(message)) {
            if (messageHelper.hasWolkeBot(message) || config.beta) {
                queueModel.findOne({server: message.guild.id}, function (err, Queue) {
                    if (err) return winston.error(err);
                    let dispatcher = voice.getDispatcher(message.guild.voiceConnection);
                    if (Queue) {
                        if (Queue.songs.length > 0) {
                            Queue.stopRepeat(function (err) {
                                if (err) return winston.error(err);
                                voice.nextSong(message, Queue.songs[0], false);
                                message.reply("Skipped Song " + Queue.songs[0].title);
                            });
                        } else {
                            if (dispatcher) {
                                dispatcher.end();
                                message.reply("Stopped current Song!");
                            } else {
                                message.reply('There is no Song playing right now!');
                            }
                        }
                    } else {
                        if (connection && connection.playing) {
                            connection.stopPlaying();
                            message.reply("Stopped current Song!");
                        } else {
                            message.reply('There is no Song in the Queue right now!');
                        }
                    }
                });
            } else {
                message.reply('No Permission! Use !w.voteskip or give yourself the WolkeBot Role.');
            }
        } else {
            message.reply("I am not connected to any Voice Channel on this Server!");
        }
    } else {
        message.reply('This Command does not work in private Channels');
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};