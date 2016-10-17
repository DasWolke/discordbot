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
var cmd = 'stream';
var config = require('../config/main.json');
var icy = require("icy");
var fs = require('fs');
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
    let messageSplit = message.content.split(' ');
    if (message.guild) {
        if (messageHelper.hasWolkeBot(message) || config.beta) {
            if (typeof (messageSplit[1]) !== 'undefined') {
                icy.get(messageSplit[1], function (res) {
                    console.log(res.rawHeaders);
                    voice.streamSong(message, res);
                });
            } else {
                message.reply(t('generic.empty-search', {lngs:message.lang}));
            }
        } else {
            message.reply(t('generic.no-permission', {lngs:message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs:message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 2, exec: pre};