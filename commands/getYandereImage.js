/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var request = require('request');
var general = require('../utility/general');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'yandere';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (message.guild) {
        messageHelper.checkNsfw(message, function (err) {
            if (err) return message.reply(t('nsfw-images.no-nsfw-channel', {lngs:message.lang}));
            yandere(message, messageSplit);
        });
    } else {
        yandere(message, messageSplit);
    }
};
var yandere = function (message, messageSplit) {
    var messageSearch = "";
    for (var i = 1; i < messageSplit.length; i++) {
        if (i === 1) {
            messageSearch = messageSplit[i];
        } else {
            messageSearch = messageSearch + "+" + messageSplit[i];
        }
    }
    messageSearch += '+%20order%3Ascore+%20rating:explicit';
    request.get('https://yande.re/post.json?limit=500&tags=' + messageSearch, function (error, response, body) {
        if (error) {
            message.reply('a error occured!');
        }
        if (!error && response.statusCode == 200) {
            try {
                body = JSON.parse(body);
            } catch (e) {
                winston.info(e.getMessage());
            }
            if (typeof (body) !== 'undefined' && body.length > 0) {
                var random = general.random(0, body.length);
                random = Math.floor(random);
                if (typeof(body[random]) !== 'undefined' && typeof (body[random].file_url) !== 'undefined') {
                    message.channel.sendMessage(body[random].file_url, function (err, message) {
                        if (err) return winston.info(err);
                    });
                } else {

                }
            } else {
                message.reply(t('nsfw-images.nothing-found', {lngs:message.lang, tags:messageSearch.replace(/\+/g, " ")}));
            }
        }
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};