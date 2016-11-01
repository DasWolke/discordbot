/**
 * Created by julia on 18.10.2016.
 */
/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'fw';
var logger = require('../../utility/logger');
var winston = logger.getT();
var set = require('./farewell/set');
var reset = require('./farewell/reset');
var execute = function (message) {
    let messageSplit = message.content.split(' ').slice(2);
    // winston.info(messageSplit);
    if (messageSplit.length > 0) {
        switch (messageSplit[0]) {
            case "set":
                set.exec(message);
                return;
            case "reset":
                reset.exec(message);
                return;
            default:
                return;
        }
    } else {
        message.reply('What do you want to do radio?');
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};