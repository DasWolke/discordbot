/**
 * Created by julia on 06.10.2016.
 */
var cmd = '8ball';
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var general = require('../utility/general');
var execute = function (message) {
    var random = general.random(0, 7);
    message.reply(t(`8ball.${random}`));
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};