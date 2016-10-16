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
    var reply = `${t('help.intro_2', {lngs: message.lang})} ${message.botUser.user.username}, ${t('help.intro',{lngs: message.lang})} 
                 \`\`\`${pre}help --> ${t('help.help',{lngs: message.lang})} 
${t('help.support',{lngs: message.lang})}: 
${pre}bug --> ${t('help.bug',{lngs: message.lang})}
${pre}add --> ${t('help.add',{lngs: message.lang})}  
-------------------------------- 
${t('help.music',{lngs: message.lang})}: 
${pre}voice --> ${t('help.voice',{lngs: message.lang})} 
${pre}leave --> ${t('help.silent',{lngs: message.lang})}
${pre}play name --> ${t('help.play',{lngs: message.lang})}
${pre}pause --> ${t('help.pause',{lngs: message.lang})}
${pre}resume --> ${t('help.resume',{lngs: message.lang})}
${pre}volume 40 --> ${t('help.volume',{lngs: message.lang})}
${pre}forever name --> ${t('help.forever',{lngs: message.lang})}
${pre}search name --> ${t('help.search',{lngs: message.lang})}
${pre}skip --> ${t('help.skip',{lngs: message.lang})}
${pre}voteskip --> ${t('help.voteskip',{lngs: message.lang})}
${pre}qa name --> ${t('help.qa',{lngs: message.lang})}
${pre}qra number --> ${t('help.qra',{lngs: message.lang})}
${pre}queue --> ${t('help.queue',{lngs: message.lang})}
${pre}np --> ${t('help.np',{lngs: message.lang})}
${pre}rq number--> ${t('help.rq',{lngs: message.lang})}
${pre}osu --> ${t('help.osu',{lngs: message.lang})}
--------------------------------\`\`\``;
    var reply2 =`\`\`\`
${t('help.youtube',{lngs: message.lang})}:
${pre}yts query --> ${t('help.yts',{lngs: message.lang})}
${pre}ytq query --> ${t('help.osu',{lngs: message.lang})}
--------------------------------
${t('help.mod',{lngs: message.lang})}:
${t('help.mod-info',{lngs: message.lang})}
${pre}info--> ${t('help.info',{lngs: message.lang})}
${pre}ban @user --> ${t('help.ban',{lngs: message.lang})}
${pre}kick @user --> ${t('help.kick',{lngs: message.lang})}
${pre}rm 10 --> ${t('help.rm',{lngs: message.lang})}
${pre}noLevelServer --> ${t('help.noLevelServer',{lngs: message.lang})}
${pre}noPmServer --> ${t('help.noPmServer',{lngs: message.lang})}
${pre}setLewd --> ${t('help.setLewd',{lngs: message.lang})}
${pre}remLewd --> ${t('help.remLewd',{lngs: message.lang})}
${pre}setPrefix --> ${t('help.setPrefix',{lngs: message.lang})}
--------------------------------\`\`\``;
    var reply3 =
        `\`\`\`
${t('help.other',{lngs: message.lang})}: 
${pre}r34 tags --> ${t('help.r34',{lngs: message.lang})}
${pre}kona tags --> ${t('help.kona',{lngs: message.lang})} 
${pre}e621 tags --> ${t('help.e621',{lngs: message.lang})} 
${pre}yandere tags --> ${t('help.yandere',{lngs: message.lang})}
${pre}level --> ${t('help.level',{lngs: message.lang})}
${pre}rank --> ${t('help.rank',{lngs: message.lang})} 
${pre}noLevel --> ${t('help.noLevel',{lngs: message.lang})}
${pre}noPm --> ${t('help.noPm',{lngs: message.lang})}
${pre}pp beatmaplink acc mods --> ${t('help.pp',{lngs: message.lang})}
${pre}cookie @user --> ${t('help.cookie',{lngs: message.lang})}
${pre}eatCookie --> ${t('help.eatCookie',{lngs: message.lang})}
${pre}git --> ${t('help.git',{lngs: message.lang})}
${pre}roll number --> ${t('help.roll',{lngs: message.lang})}
${pre}8ball message --> ${t('help.8ball',{lngs: message.lang})}
${pre}garfield --> ${t('help.garfield',{lngs: message.lang})}
${pre}cat --> ${t('help.cat',{lngs: message.lang})}
${pre}hug --> ${t('help.hug',{lngs: message.lang})}
${pre}slap --> ${t('help.slap',{lngs: message.lang})}
${pre}setLang --> ${t('help.setLang',{lngs: message.lang})}
${t('help.feedback',{lngs: message.lang})}
${t('help.talk',{lngs: message.lang})}\`\`\``;
    message.author.sendMessage(reply).then(replyMessage => {
        message.author.sendMessage(reply2).then(message2 => {
            message.author.sendMessage(reply3);
        });
    }).catch(winston.warn);
    if (message.guild) {
        message.reply(t('help.helpReply',{lngs: message.lang}));
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};