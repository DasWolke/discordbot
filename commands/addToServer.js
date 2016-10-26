/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'add';
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var config = require('../config/main.json');
var execute = function (message) {
    if (message.guild) {
        message.channel.sendMessage(':ok_hand: ');
    }
    message.author.sendMessage(t('add', {link:`\<https://discordapp.com/oauth2/authorize?client_id=${config.client_id}&scope=bot&permissions=66321471\>`, lngs:message.lang, interpolation: {escape: false}}));
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'support'};