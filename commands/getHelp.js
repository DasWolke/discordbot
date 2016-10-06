/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'help';
var logger = require('../utility/logger');
var winston = logger.getT();
var execute = function (message) {
    var reply = `${t('basic.help.intro_2')} ${message.botUser.user.name}, ${t('basic.help.intro')} 
                 \`\`\`!w.help --> ${t('basic.help.help')} 
${t('basic.help.support')}: 
!w.bug --> ${t('basic.help.bug')}
!w.add --> ${t('basic.help.add')}  
-------------------------------- 
${t('basic.help.music')}: 
!w.voice --> ${t('basic.help.voice')} 
!w.silent --> ${t('basic.help.silent')}
!w.play name --> ${t('basic.help.play')}
!w.pause --> ${t('basic.help.pause')}
!w.resume --> ${t('basic.help.resume')}
!w.volume 40 --> ${t('basic.help.volume')}
!w.forever name --> ${t('basic.help.forever')}
!w.search name --> ${t('basic.help.search')}
!w.skip --> ${t('basic.help.skip')}
!w.voteskip --> ${t('basic.help.voteskip')}
!w.qa name --> ${t('basic.help.qa')}
!w.qrl --> ${t('basic.help.qrl')}
!w.qra number --> ${t('basic.help.qra')}
!w.queue --> ${t('basic.help.queue')}
!w.np --> ${t('basic.help.np')}
!w.rq --> ${t('basic.help.rq')}
!w.random --> ${t('basic.help.random')}
!w.osu maplink --> ${t('basic.help.osu')}
--------------------------------\`\`\``;
    var reply2 =
        "```" +
        "Youtube:\n" +
        "!w.yts query --> Searches Youtube and gives you the First Result\n" +
        "!w.ytq query --> Searches Youtube and adds the First Result to the Queue\n" +
        "--------------------------------\n" +
        "Moderation\n" +
        "These Commands all require that the user has a Discord Role named WolkeBot\n" +
        "!w.ban @user --> Bans a User and deletes 7 Days of his/her messages\n" +
        "!w.kick @user --> Kicks a User\n" +
        "!w.rm 10 --> removes the last 10 Messages, you can change 10 to a value between 1-100\n" +
        "!w.noLevelServer --> disables the level system for the whole server, already gained levels are preserved. Use again to enable it again for the server.\n" +
        "!w.noPmServer --> disables the PM notifications for the whole server. Use again to enable it again for the server.\n" +
        "!w.setLewd --> Adds the current Channel as a NSFW Channel\n" +
        "!w.remLewd --> Removes the current channel from the list of NSFW channels\n" +
        "--------------------------------```";
    var reply3 =
        "```Other Stuff:\n" +
        "!w.r34 tags --> Searches Rule34 for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
        "!w.kona tags --> Searches Konachan for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
        "!w.e621 tags --> Searches E621 for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
        "!w.yandere tags --> Searches Yande.re for tags and gives back 1 Image, only usable with WolkeBot Role or a configured NSFW Channel.\n" +
        "!w.level --> Your Level and XP needed for next Level\n" +
        "!w.rank --> Leaderboard for this Server\n" +
        "!w.noLevel --> disables the level system for you. Use again to enable it again for you.\n" +
        "!w.noPm --> disables the PM notifications for you. Use again to enable it again for you.\n" +
        "!w.pp beatmaplink acc mods --> Calculates PP for the beatmap with optional accuracy\n" +
        "!w.cookie @user --> Gives a cookie to the mentioned user or shows your cookies if no one is mentioned. (giving cookies is only usable with WolkeBot role)\n" +
        "!w.eatCookie --> Eats a Cookie.\n" +
        "!w.git --> Gives you the github link of the bot\n" +
        "For feedback use the support discord please ^^\n" +
        "If you want to talk with me @mention me with a message :D```";
    message.author.sendMessage(reply).then(replyMessage => {
        message.author.sendMessage(reply2).then(message2 => {
            message.author.sendMessage(reply3);
        });
    }).catch(winston.warn);
    if (message.guild) {
        message.reply(t('basic.help.helpReply'));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};