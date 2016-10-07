/**
 * Created by julia on 02.10.2016.
 */
var messageHelper = require('../utility/message');
var X2 = require('x2js');
var x2js = new X2();
var request = require('request');
var general = require('../utility/general');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'r34';
var execute = function (message) {
    let messageSplit = message.content.split(' ');
    if (message.guild) {
        messageHelper.checkNsfw(message, function (err) {
            if (err) return message.reply(err);
            r34(message, messageSplit);
        });
    } else {
        r34(message, messageSplit);
    }
};
var r34 = function (message, messageSplit) {
        if (typeof (messageSplit[1]) !== 'undefined') {
            var messageSearch = "";
            for (var i = 1 ; i < messageSplit.length; i++) {
                if (i === 1) {
                    messageSearch = messageSplit[i];
                } else {
                    messageSearch = messageSearch + "+" + messageSplit[i];
                }
            }
            request.get('http://rule34.xxx/index.php?page=dapi&s=post&q=index&limit=100&tags=' + messageSearch,function (error, response, body) {
                if (error) {
                    message.reply('a error occured!');
                }
                if (!error && response.statusCode == 200) {
                    var jsonObj = x2js.xml2js(body);
                    if (typeof (jsonObj.posts.post) !== 'undefined') {
                        var random = general.random(0, jsonObj.posts.post.length);
                        random = Math.floor(random);
                        if (typeof(jsonObj.posts.post[random]) !== 'undefined' && typeof (jsonObj.posts.post[random]._file_url) !== 'undefined') {
                            message.channel.sendMessage('http:' + jsonObj.posts.post[random]._file_url, function (err, message) {
                                if (err) return console.log(err);
                            });
                        } else {

                        }
                    } else {
                        message.reply('No images found with Tags: ' + messageSearch.replace(/%20/g, " "));
                    }
                }
            });
        } else {
            message.reply('No Search Term entered!');
        }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};