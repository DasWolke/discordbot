/**
 * Created by julia on 29.09.2016.
 */
var songModel = require('../../../../DB/song');
var voice = require('../../../utility/voice');
var logger = require('../../../utility/logger');
var general = require('../../../utility/general');
var winston = logger.getT();
var randomSongQueue = function (bot,message) {
    if (message.guild) {
        songModel.count({}, function (err, C) {
            if (err) return message.reply("A Database Error occured!");
            var random = general.random(0, C);
            songModel.find({}, function (err, Songs) {
                if (err) return winston.error(err);
                if (typeof(Songs[random]) !== 'undefined') {
                    var Song = Songs[random];
                    if (voice.inVoice(bot, message)) {
                        voice.addToQueue(bot, message, Song);
                    } else {
                        message.reply("I am not connected to any Voice Channel on this Server!");
                    }
                } else {
                    message.reply('A Error occured!');
                }
            });
        });
    } else {
        message.reply('This Command does not work in private Channels');
    }
};
module.exports = randomSongQueue;