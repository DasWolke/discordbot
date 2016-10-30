/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'mod';
var radio = require('./mod/radio');
var lang = require('./mod/lang');
var config = require('../config/main.json');
var execute = function (message) {
    if (message.author.id === config.owner_id) {
        let messageSplit = message.content.split(' ').slice(1);
        if (messageSplit.length > 0) {
            switch (messageSplit[0]) {
                case "radio":
                    radio.exec(message);
                    return;
                case "lang":
                    lang.exec(message);
                    return;
                case "rra":
                    return;
                // case "resolve":
                //     message.reply(encodeURIComponent('麻枝 准×やなぎなぎ終わりの世界から'));
                //     return;
                default:
                    return;
            }
        } else {
            message.reply('What do you want to do ?');
        }
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'admin'};