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
var cmd = 'kona';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (message.guild) {
        messageHelper.checkNsfw(message, function (err) {
            if (err) return message.reply(t('nsfw-images.no-nsfw-channel', {
                lngs: message.lang,
                prefix: message.prefix
            }));
            konachan(message, messageSplit);
        });
    } else {
        konachan(message, messageSplit);
    }
};
var konachan = function (message, messageSplit) {

    let msgSearch = "";
    let searchOrig = "";
    for (var i = 1; i < messageSplit.length; i++) {
        if (i === 1) {
            searchOrig = messageSplit[i];
        } else {
            searchOrig = searchOrig + "+" + messageSplit[i];
        }
    }
    msgSearch = 'order:score rating:questionableplus ' + searchOrig;
    request.get('https://konachan.com/post.json', {
        qs: {
            limit: 200,
            tags: msgSearch
        }
    }, function (error, response, body) {
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
                    message.channel.sendMessage(`http://${body[random].file_url.substring(2)}`, function (err, message) {
                        if (err) return winston.info(err);
                    });
                } else {

                }
            } else {
                message.reply(t('nsfw-images.nothing-found', {
                    lngs: message.lang,
                    tags: searchOrig
                }));
            }
        }
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'nsfw'};