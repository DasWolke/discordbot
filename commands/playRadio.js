/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var osu = require('../utility/osu');
var winston = logger.getT();
var songModel = require('../DB/song');
var cmd = 'stream';
var config = require('../config/main.json');
var icy = require("icy");
var fs = require('fs');
var MessageCollector = require('discord.js').MessageCollector;
var pre = function (message) {
    if (message.guild) {
        voice.getInVoice(message, (err, msg) => {
            if (err) return message.reply(err);
            execute(msg);
        })
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
var execute = function (message) {
    if (message.guild) {
        let messageSplit = message.content.split(' ').slice(1);
        let messageFormat = "";
        for (var i = 0; i < messageSplit.length; i++) {
            if (i === 0) {
                messageFormat = messageSplit[i];
            } else {
                messageFormat = messageFormat + " " + messageSplit[i];
            }
        }
        if (messageSplit.length > 0) {
            songModel.find({
                $text: {$search: messageFormat},
                type: "radio"
            }, {score: {$meta: "textScore"}}).sort({score: {$meta: "textScore"}}).limit(5).exec(function (err, Radios) {
                if (err) return message.reply(err);
                let titles = [];
                for (var i = 0; i < Radios.length; i++) {
                    titles.push(`${i + 1}:${Radios[i].title}\n`);
                }
                titles.push('c:cancel');
                message.channel.sendMessage(`${messageHelper.buildPrologMessage(titles)}`).then(() => {
                    input(message, Radios);
                });
            });
        } else {
            songModel.find({type: "radio"}).limit(5).exec(function (err, Radios) {
                if (err) return message.reply(err);
                let titles = [];
                for (var i = 0; i < Radios.length; i++) {
                    titles.push(`${i + 1}:${Radios[i].title}\n`);
                }
                titles.push('c:cancel');
                message.channel.sendMessage(`${messageHelper.buildPrologMessage(titles)}`).then(() => {
                    input(message, Radios);
                });
            });
        }
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
var input = function (message, Radios) {
    let collector = new MessageCollector(message.channel, messageHelper.filterSelection, {max: 1});
    collector.on('end', (collection, reason) => {
        let msg = collection.first();
        let number = 10;
        try {
            number = parseInt(msg.content)
        } catch (e) {

        }
        if (!isNaN(number) && number <= Radios.length) {
            icy.get(Radios[number - 1].url, (res) => {
                voice.addSongFirst(message, Radios[number - 1], false).then(() => {
                    voice.streamSong(message, res);
                    message.channel.sendMessage(t('play.playing', {
                        song: Radios[number - 1].title,
                        interpolation: {escape: false}
                    }));
                }).catch(message.reply);
            });
        }
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: pre};