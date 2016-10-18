/**
 * Created by julia on 18.10.2016.
 */
/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'lang';
var reload = require('./translation/reloadTranslation');
// var config = require('../../config/main.json');
var execute = function (message) {
    let messageSplit = message.content.split(' ').slice(2);
    console.log(messageSplit);
    if (messageSplit.length > 0) {
        switch (messageSplit[0]) {
            case "reload":
                reload.exec(message);
                return;
            case "list":
                return;
            default:
                return;
        }
    } else {
        message.reply('What do you want to do radio?');
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};