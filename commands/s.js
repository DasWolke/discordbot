/**
 * Created by julia on 02.10.2016.
 */
var cmd = 's';
var config = require('../config/main.json');
var greeting = require('./server/greeting');
var farewell = require('./server/farewell');
var execute = function (message) {
    let messageSplit = message.content.split(' ').slice(1);
    if (messageSplit.length > 0) {
        switch (messageSplit[0]) {
            case "gr":
                greeting.exec(message);
                return;
            case "fw":
                farewell.exec(message);
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
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'moderation'};