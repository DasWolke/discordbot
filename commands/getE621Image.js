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
var cmd = 'e621';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (message.guild) {
        messageHelper.checkNsfw(message, function (err) {
            if (err) return message.reply(t('nsfw-images.no-nsfw-channel', {lngs:message.lang}));
            e621(message, messageSplit);
        });
    } else {
        e621(message, messageSplit);
    }
};
var e621 = function (message,messageSplit) {
        var messageSearch = "";
        for (var i = 1 ; i < messageSplit.length; i++) {
            if (i === 1) {
                messageSearch = messageSplit[i];
            } else {
                messageSearch = messageSearch + "+" + messageSplit[i];
            }
        }
        let options = {
            url:'https://e621.net/post/index.json?limit=200&tags=' + messageSearch,
            headers: {
                'User-Agent': 'Rem Discordbot https://github.com/DasWolke/discordbot'
            }
        };
        request.get(options,function (error, response, body) {
            if (error) {
                message.reply(t('generic.error', {lngs:message.lang}));
            }
            if (!error && response.statusCode == 200) {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    console.log(e.message);
                }
                if (typeof (body) !== 'undefined' && body.length > 0) {
                    var random = general.random(0, body.length);
                    random = Math.floor(random);
                    if (typeof(body[random]) !== 'undefined' && typeof (body[random].file_url) !== 'undefined') {
                        message.channel.sendMessage(body[random].file_url, function (err, message) {
                            if (err) return console.log(err);
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