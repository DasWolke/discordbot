/**
 * Created by julia on 29.09.2016.
 */
var logger = require('../../../../utility/logger');
var winston = logger.getT();
var voice = require('../../../../utility/voice');
var messageHelper = require('../../../../utility/message');
var queueModel = require('../../../../DB/queue');
var skipSong = function (bot,message) {
    if (message.guild) {
        if (voice.inVoicemessage)) {
            if (messageHelper.hasWolkeBot(message)) {
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
module.exports = skipSong;