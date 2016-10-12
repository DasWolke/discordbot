/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var cmd = 'help';
var logger = require('../utility/logger');
var winston = logger.getT();
var execute = function (message) {
    let pre = message.prefix;
    var reply = `${t('basic.help.intro_2', {lng: message.lang})} ${message.botUser.user.username}, ${t('basic.help.intro',{lng: message.lang})} 
                 \`\`\`${pre}help --> ${t('basic.help.help',{lng: message.lang})} 
${t('basic.help.support',{lng: message.lang})}: 
${pre}bug --> ${t('basic.help.bug',{lng: message.lang})}
${pre}add --> ${t('basic.help.add',{lng: message.lang})}  
-------------------------------- 
${t('basic.help.music',{lng: message.lang})}: 
${pre}voice --> ${t('basic.help.voice',{lng: message.lang})} 
${pre}leave --> ${t('basic.help.silent',{lng: message.lang})}
${pre}play name --> ${t('basic.help.play',{lng: message.lang})}
${pre}pause --> ${t('basic.help.pause',{lng: message.lang})}
${pre}resume --> ${t('basic.help.resume',{lng: message.lang})}
${pre}volume 40 --> ${t('basic.help.volume',{lng: message.lang})}
${pre}forever name --> ${t('basic.help.forever',{lng: message.lang})}
${pre}search name --> ${t('basic.help.search',{lng: message.lang})}
${pre}skip --> ${t('basic.help.skip',{lng: message.lang})}
${pre}voteskip --> ${t('basic.help.voteskip',{lng: message.lang})}
${pre}qa name --> ${t('basic.help.qa',{lng: message.lang})}
${pre}qrl --> ${t('basic.help.qrl',{lng: message.lang})}
${pre}qra number --> ${t('basic.help.qra',{lng: message.lang})}
${pre}queue --> ${t('basic.help.queue',{lng: message.lang})}
${pre}np --> ${t('basic.help.np',{lng: message.lang})}
${pre}random --> ${t('basic.help.random',{lng: message.lang})}
${pre}rq number--> ${t('basic.help.rq',{lng: message.lang})}
${pre}osu --> ${t('basic.help.osu',{lng: message.lang})}
--------------------------------\`\`\``;
    var reply2 =`\`\`\`
${t('basic.help.youtube',{lng: message.lang})}:
${pre}yts query --> ${t('basic.help.yts',{lng: message.lang})}
${pre}ytq query --> ${t('basic.help.osu',{lng: message.lang})}
--------------------------------
${t('basic.help.mod',{lng: message.lang})}:
${t('basic.help.mod-info',{lng: message.lang})}
${pre}info--> ${t('basic.help.info',{lng: message.lang})}
${pre}ban @user --> ${t('basic.help.ban',{lng: message.lang})}
${pre}kick @user --> ${t('basic.help.kick',{lng: message.lang})}
${pre}rm 10 --> ${t('basic.help.rm',{lng: message.lang})}
${pre}noLevelServer --> ${t('basic.help.noLevelServer',{lng: message.lang})}
${pre}noPmServer --> ${t('basic.help.noPmServer',{lng: message.lang})}
${pre}setLewd --> ${t('basic.help.setLewd',{lng: message.lang})}
${pre}remLewd --> ${t('basic.help.remLewd',{lng: message.lang})}
${pre}setPrefix --> ${t('basic.help.setPrefix',{lng: message.lang})}
--------------------------------\`\`\``;
    var reply3 =
        `\`\`\`
${t('basic.help.other',{lng: message.lang})}: 
${pre}r34 tags --> ${t('basic.help.r34',{lng: message.lang})}
${pre}kona tags --> ${t('basic.help.kona',{lng: message.lang})} 
${pre}e621 tags --> ${t('basic.help.e621',{lng: message.lang})} 
${pre}yandere tags --> ${t('basic.help.yandere',{lng: message.lang})}
${pre}level --> ${t('basic.help.level',{lng: message.lang})}
${pre}rank --> ${t('basic.help.rank',{lng: message.lang})} 
${pre}noLevel --> ${t('basic.help.noLevel',{lng: message.lang})}
${pre}noPm --> ${t('basic.help.noPm',{lng: message.lang})}
${pre}pp beatmaplink acc mods --> ${t('basic.help.pp',{lng: message.lang})}
${pre}cookie @user --> ${t('basic.help.cookie',{lng: message.lang})}
${pre}eatCookie --> ${t('basic.help.eatCookie',{lng: message.lang})}
${pre}git --> ${t('basic.help.git',{lng: message.lang})}
${pre}roll number --> ${t('basic.help.roll',{lng: message.lang})}
${pre}8ball message --> ${t('basic.help.8ball',{lng: message.lang})}
${pre}garfield --> ${t('basic.help.garfield',{lng: message.lang})}
${t('basic.help.feedback',{lng: message.lang})}
${t('basic.help.talk',{lng: message.lang})}\`\`\``;
    message.author.sendMessage(reply).then(replyMessage => {
        message.author.sendMessage(reply2).then(message2 => {
            message.author.sendMessage(reply3);
        });
    }).catch(winston.warn);
    if (message.guild) {
        message.reply(t('basic.help.helpReply',{lng: message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};