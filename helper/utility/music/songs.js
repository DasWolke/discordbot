/**
 * Created by julia on 23.07.2016.
 */
var queueModel = require('../../../DB/queue');
var voice = require('../voice');
var voteSkip = function voteSkip(bot, message, cb) {
    if (message.author.voiceChannel) {
        queueModel.findOne({server: message.server.id}, function (err, Queue) {
            if (err) return cb(err);
            if (Queue) {
                if (Queue.songs.length > 0) {
                    if (voice.inVoice(bot, message)) {
                        var channel = voice.getVoiceChannel(bot, message);
                        if (channel.equals(message.author.voiceChannel)) {
                            if (channel.members.length > 2) {
                                Queue.checkVote(message.author.id, function (err, found) {
                                    if (err) {
                                        console.log(err);
                                        return cb('Internal Error!');
                                    }
                                    if (!found) {
                                        Queue.updateVotes(message.author.id, function (err) {
                                            if (err) {
                                                console.log(err);
                                                return cb('Internal Error!');
                                            }
                                            Queue.reload(function (err, Queue) {
                                               if (err) return console.log(err);
                                                if (Queue) {
                                                    var voiceMembers = channel.members.length -1;
                                                    var votePercentage = Queue.voteSkip / voiceMembers;
                                                    console.log(votePercentage);
                                                    if (votePercentage > 0.51) {
                                                        voice.nextSong(bot,message, Queue.songs[0]);
                                                        cb(null, 'Voteskipped Song: ' + Queue.songs[0].title + '!');
                                                    } else {
                                                        cb(null, 'Added Your Vote');
                                                    }
                                                }
                                            });
                                        });
                                    } else {
                                        cb('You already Voted!');
                                    }
                                });
                            } else {
                                voice.nextSong(bot, message, Queue.songs[0]);
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
module.exports = {voteSkip: voteSkip};