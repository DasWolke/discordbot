/**
 * Created by julia on 24.07.2016.
 */
var messageHelper = require('../../../../utility/message');
var ytHelper = require('../../../youtube/helper');
var songModel = require('../../../../DB/song');
var voice = require('../../../../utility/voice');
var musicHelper = require('../../../../utility/music');
var osu = require('../../../utility/osu');
var add = function addToQueuemessage, messageSplit) {
    if (typeof(messageSplit[1]) === 'undefined') {
        return message.reply('You did not enter a search Term!');
    }
    var messageSearch = "";
    var a = 0;
    if (messageSplit[1] === 'add' && typeof (messageSplit[2]) !== 'undefined') {
        for (a = 2; a < messageSplit.length; a++) {
            messageSearch = messageSearch + " " + messageSplit[a]
        }
    } else {
        for (a = 1; a < messageSplit.length; a++) {
            messageSearch = messageSearch + " " + messageSplit[a]
        }
    }
    if (musicHelper.checkMedia(messageSplit[1]) || typeof (messageSplit[2]) !== 'undefined' && voice.checkMedia(messageSplit[2])) {
        ytHelper.ytDlAndQueuemessage, messageSearch, messageSplit);
    } else if (musicHelper.checkOsuMap(messageSplit[1])) {
        songModel.findOne({url:messageSplit[1]}, (err, Song) => {
            if (err) return console.log(err);
            if (Song) {
                voice.addToQueuemessage, Song).then(message.reply).catch(message.reply);
            } else {
                osu.download(message).then(Song => {
                    voice.addToQueuemessage, Song).then(message.reply).catch(message.reply);
                }).catch(message.reply);
            }
        });
    } else {
        messageSearch = messageSearch.replace('-', '');
        songModel.find({$text: {$search: `${messageSearch}`}}, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(1).exec(function (err, Songs) {
            if (err) return console.log(err);
            if (Songs !== null && Songs.length > 0) {
                voice.addToQueuemessage, Songs[0]).then(message.reply).catch(message.reply);
            } else {
                message.reply('No Song found with Search Term `' + messageHelper.cleanMessage(messageSearch) + '`');
            }
        });
    }
};
module.exports = add;