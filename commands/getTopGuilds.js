/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'top';
var AsciiTable = require('ascii-table');
let _ = require('lodash');
var execute = function (message) {
    if (message.guild) {
        let easyGuild = [];
        let table = new AsciiTable();
        message.botUser.guilds.map((guild) => {
            easyGuild.push({name:guild.name, size:guild.members.size, memberCount:guild.memberCount});
        });
        let guilds = _.sortBy(easyGuild, 'size');
        guilds = guilds.slice(0, 5);
        guilds = _.reverse(guilds);
        for (var i = 0; i < guilds.length; i++) {
            table.addRow(i+1, guilds[i].name, guilds[i].size);
        }
        message.reply(`\n\`\`\`${table.toString()}\`\`\``);
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};