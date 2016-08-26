/**
 * Created by julia on 17.08.2016.
 */
var X2 = require('x2js');
var x2js = new X2();
var request = require('request');
var general = require('../../utility/general');
var rule34 = function (bot,message,messageSplit) {
    if (typeof (messageSplit[1]) !== 'undefined') {
        var messageSearch = "";
        for (var i = 1 ; i < messageSplit.length; i++) {
            if (i === 1) {
                messageSearch = messageSplit[i];
            } else {
                messageSearch = messageSearch + "%20" + messageSplit[i];
            }
        }
        request.get('http://rule34.xxx/index.php?page=dapi&s=post&q=index&tags=' + messageSearch,function (error, response, body) {
            if (error) {
                bot.reply(message, 'a error occured!');
            }
            if (!error && response.statusCode == 200) {
                var jsonObj = x2js.xml2js(body);
                if (typeof (jsonObj.posts.post) !== 'undefined') {
                    var random = general.random(0, jsonObj.posts.post.length);
                    random = Math.floor(random);
                    if (typeof (jsonObj.posts.post[random]._file_url) !== 'undefined') {
                        bot.sendMessage(message.channel, 'http:' + jsonObj.posts.post[random]._file_url, function (err, message) {
                            if (err) return console.log(err);
                        });
                    }
            } else {
                    bot.reply(message, 'No images found with Tags: ' + messageSearch.replace(/%20/g, " "));
                }
            }
        });
    } else {
        bot.reply(message, 'No Search Term entered!');
    }
};
module.exports = rule34;