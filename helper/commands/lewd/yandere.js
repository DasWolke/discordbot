/**
 * Created by julia on 17.08.2016.
 */
var request = require('request');
var general = require('../../utility/general');
var yandere = function (bot,message,messageSplit) {
    if (typeof (messageSplit[1]) !== 'undefined') {
        var messageSearch = "";
        for (var i = 1 ; i < messageSplit.length; i++) {
            if (i === 1) {
                messageSearch = messageSplit[i];
            } else {
                messageSearch = messageSearch + "+" + messageSplit[i];
            }
        }
        request.get('https://yande.re/post.json?limit=500&tags=' + messageSearch,function (error, response, body) {
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
module.exports = yandere;