/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'rank';
var execute = function (message) {
    if (message.guild) {
        message.reply(`You can find the Leaderboard for this Server here: http://bot.ram.moe/l/${message.guild.id}`);
    } else {
        message.reply(`This command does not work in Pm's!`);
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};