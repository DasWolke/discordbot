/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'top';
var AsciiTable = require('ascii-table');
let _ = require('underscore');
var execute = function (message) {
    if (message.guild) {
        let table = new AsciiTable();
        let guilds = message.botUser.guilds.array();
        guilds = _.sortBy(guilds, 'members.size');
        guilds = guilds.slice(0, 5);
        for (var i = 0; i < guilds.length; i++) {
            table.addRow(i+1, guilds[i].name, guilds[i].members.size);
        }
        message.reply(`\n\`\`\`${table.toString()}\`\`\``);
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};