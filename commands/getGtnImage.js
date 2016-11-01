/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var request = require('request');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'gtn';
var execute = function (message) {
    if (message.guild) {
        messageHelper.checkNsfw(message, function (err) {
            if (err) return message.reply(t('nsfw-images.no-nsfw-channel', {lngs: message.lang}));
            gtn(message);
        });
    } else {
        gtn(message);
    }
};
var gtn = function (message) {
    request.get('https://rra.ram.moe/i/r?type=nsfw-gtn&nsfw=true', (err, result, body) => {
        if (err) return winston.error(err);
        let parsedBody = JSON.parse(body);
        message.channel.sendMessage(`https://rra.ram.moe${parsedBody.path}`);
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'nsfw'};