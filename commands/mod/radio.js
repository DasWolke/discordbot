/**
 * Created by julia on 18.10.2016.
 */
/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'radio';
// var config = require('../../config/main.json');
var add = require('./radio/add');
var execute = function (message) {
    let messageSplit = message.content.split(' ').slice(2);
    // console.log(messageSplit);
    if (messageSplit.length > 0) {
        switch (messageSplit[0]) {
            case "add":
                add.exec(message);
                return;
            case "list":
                return;
            case "remove":
                return;
            default:
                return;
        }
    } else {
        message.reply('What do you want to do radio?');
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};