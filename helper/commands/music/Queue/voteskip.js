/**
 * Created by julia on 29.09.2016.
 */
var queueModel = require('../../../../DB/queue');
var voice = require('../../../utility/voice');
var logger = require('../../../utility/logger');
var winston = logger.getT();
var voteskipCommand = function (bot, message) {
    if (message.guild) {
        voteSkip(bot, message, function (err, response) {
            if (err) {
                return message.reply(err);
            }
            message.reply(response);
        });
    } else {
        message.reply('This Command does not work in private Channels');
    }
};
var voteSkip = function voteSkip(bot, message, cb) {
    if (message.member.voiceChannel) {
        queueModel.findOne({server: message.guild.id}, function (err, Queue) {
            if (err) return cb(err);
            if (Queue) {
                if (Queue.songs.length > 0) {
                    if (voice.inVoice(bot, message)) {
                        var channel = voice.getVoiceChannel(bot, message);
                        if (channel.id === message.member.voiceChannelID) {
                            if (channel.members.size > 2) {
                                Queue.checkVote(message.author.id, function (err, found) {
                                    if (err) {
                                        winston.info(err);
                                        return cb('Internal Error!');
                                    }
                                    if (!found) {
                                        Queue.updateVotes(message.author.id, function (err) {
                                            if (err) {
                                                winston.info(err);
                                                return cb('Internal Error!');
                                            }
                                            Queue.reload(function (err, Queue) {
                                                if (err) return winston.info(err);
                                                if (Queue) {
                                                    var voiceMembers = channel.members.size - 1;
                                                    var votePercentage = Queue.voteSkip / voiceMembers;
                                                    if (votePercentage > 0.51) {
                                                        Queue.stopRepeat(function (err) {
                                                            if (err) return cb(err);
                                                            voice.nextSong(bot, message, Queue.songs[0]);
                                                            cb(null, 'Voteskipped Song: ' + Queue.songs[0].title + '!');
                                                        });
                                                    } else {
                                                        cb(null, `Added Your Vote, votepercentage at **${votePercentage * 100}%/${51}%**`);
                                                    }
                                                }
                                            });
                                        });
                                    } else {
                                        cb('You already Voted!');
                                    }
                                });
                            } else {
                                Queue.stopRepeat(function (err) {
                                    if (err) return cb(err);
                                    voice.nextSong(bot, message, Queue.songs[0]);
                                });
                            }
                        } else {
                            return cb('You are not in the same Voicechannel as the Bot!');
                        }
                    } else {
                        return cb('No Voice Connection at the Moment!');
                    }
                } else {
                    return cb('No Song in the Queue!');
                }
            } else {
                return cb('No Song in the Queue!');
            }
        });
    } else {
        return cb('You can not voteskip, if you are not in a Voicechannel!');
    }
};
module.exports = voteskipCommand;