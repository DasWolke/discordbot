/**
 * Created by julia on 17.08.2016.
 */
var request = require('cloudscraper');
var general = require('../../utility/general');
var e621 = function (bot,message,messageSplit) {
    if (typeof (messageSplit[1]) !== 'undefined') {
        var messageSearch = "";
        for (var i = 1 ; i < messageSplit.length; i++) {
            if (i === 1) {
                messageSearch = messageSplit[i];
            } else {
                messageSearch = messageSearch + "+" + messageSplit[i];
            }
        }
        request.get('https://e621.net/post/index.json?limit=200&tags=' + messageSearch,function (error, response, body) {
            if (error) {
                bot.reply(message, 'a error occured!');
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
                        bot.sendMessage(message.channel, body[random].file_url, function (err, message) {
                            if (err) return console.log(err);
                        });
                    } else {

                    }
                } else {
                    bot.reply(message, 'No images found with Tags: ' + messageSearch.replace(/\+/g, " "));
                }
            }
        });
    } else {
        bot.reply(message, 'No Search Term entered!');
    }
};
module.exports = e621;