/**
 * Created by julia on 18.10.2016.
 */
/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'gr';
var logger = require('../../utility/logger');
var set = require('./greeting/set');
var reset = require('./greeting/reset');
var winston = logger.getT();
var i18nBean = require('../../utility/i18nManager');
var t = i18nBean.getT();
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
        message.reply(t('greeting.no-add', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};