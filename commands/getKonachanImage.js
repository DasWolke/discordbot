/**
 * Created by julia on 02.10.2016.
 */
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
            if (err) return message.reply(err);
            konachan(message, messageSplit);
        });
    } else {
        konachan(message, messageSplit);
    }
};
var konachan = function (message, messageSplit) {
    if (typeof (messageSplit[1]) !== 'undefined') {
        var messageSearch = "";
        for (var i = 1; i < messageSplit.length; i++) {
            if (i === 1) {
                messageSearch = messageSplit[i];
            } else {
                messageSearch = messageSearch + "+" + messageSplit[i];
            }
        }
        request.get('https://konachan.com/post.json?limit=500&tags=' + messageSearch, function (error, response, body) {
            if (error) {
                message.reply('a error occured!');
            }
            if (!error && response.statusCode == 200) {
                try {
                    body = JSON.parse(body);
                } catch (e) {
                    console.log(e.getMessage());
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
                    message.reply('No images found with Tags: ' + messageSearch.replace(/\+/g, " "));
                }
            }
        });
    } else {
        message.reply('No Search Term entered!');
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};