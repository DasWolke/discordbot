/**
 * Created by julia on 29.09.2016.
 */
var songModel = require('../../../../DB/song');
var messageHelper = require('../../../utility/message');
var general = require('../../../utility/general');
var voice = require('../../../utility/voice');
var logger = require('../../../utility/logger');
var winston = logger.getT();
var randomSong = function (bot,message) {
    if (message.guild) {
        if (messageHelper.hasWolkeBot(bot, message)) {
            songModel.count({}, function (err, C) {
                if (err) return message.reply("A Database Error occured!");
                var random = general.random(0, C);
                songModel.find({}, function (err, Songs) {
                    if (err) return winston.error(err);
                    if (typeof(Songs[random]) !== 'undefined') {
                        var Song = Songs[random];
                        if (voice.inVoice(bot, message)) {
                            voice.addSongFirst(bot, message, Song, false, function (err) {
                                if (err) return winston.error(err);
                                voice.playSong(bot, message, Song);
                            });
                        } else {
                            message.reply("I am not connected to any Voice Channel on this Server!");
                        }
                    } else {
                        message.reply('A Error occured!');
                    }
                });
            });
        } else {
            message.reply('No Permission! You need to use !w.rq or give yourself the WolkeBot Role to use this.');
        }
    } else {
        message.reply('This Command does not work in private Channels');
    }
};
module.exports = randomSong;