/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'top';
var AsciiTable = require('ascii-table');
let _ = require('lodash');
var execute = function (message) {
    let easyGuild = [];
    let table = new AsciiTable();
    message.botUser.guilds.map((guild) => {
        let users = guild.members.filter((member) => {
            return !member.user.bot
        });
        easyGuild.push({
            name: guild.name,
            size: users.size,
            memberCount: guild.memberCount,
            withBots: guild.memberCount
        });
    });
    let guilds = _.sortBy(easyGuild, 'size');
    guilds = _.reverse(guilds);
    guilds = guilds.slice(0, 10);
    for (var i = 0; i < guilds.length; i++) {
        table.addRow(i + 1, guilds[i].name, guilds[i].size, `Bots:${guilds[i].withBots - guilds[i].size}`, `C:${guilds[i].memberCount}`);
    }
    message.reply(`\n\`\`\`${table.toString()}\`\`\``);
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'stats'};