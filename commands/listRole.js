/**
 * Created by julia on 30.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var logger = require('../utility/logger');
var serverModel = require('../DB/server');
var winston = logger.getT();
var cmd = 'lr';
var AsciiTable = require('ascii-table');
var exec = (message) => {
    if (message.guild) {
        if (typeof(message.dbServer.roles) !== 'undefined' && message.dbServer.roles.length > 0) {
            let roles = message.dbServer.roles;
            var table = new AsciiTable();
            table.removeBorder();
            table.setHeading('nr', 'id', 'name', 'self', 'lvl', 'default');
            for (var i = 0; i < message.dbServer.roles.length; i++) {
                table.addRow(i + 1, roles[i].id, roles[i].name, roles[i].self, roles[i].level, roles[i].default);
            }
            message.channel.sendCode('', table.toString());
        } else {
            message.channel.sendMessage(':x: ')
        }
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: exec, cat: 'admin'};