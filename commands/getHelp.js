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
    var reply = `${t('basic.help.intro_2')} ${message.botUser.user.name}, ${t('basic.help.intro')} 
                 \`\`\`!w.help --> ${t('basic.help.help')} 
${t('basic.help.support')}: 
${pre}bug --> ${t('basic.help.bug')}
${pre}add --> ${t('basic.help.add')}  
-------------------------------- 
${t('basic.help.music')}: 
${pre}voice --> ${t('basic.help.voice')} 
${pre}leave --> ${t('basic.help.silent')}
${pre}play name --> ${t('basic.help.play')}
${pre}pause --> ${t('basic.help.pause')}
${pre}resume --> ${t('basic.help.resume')}
${pre}volume 40 --> ${t('basic.help.volume')}
${pre}forever name --> ${t('basic.help.forever')}
${pre}search name --> ${t('basic.help.search')}
${pre}skip --> ${t('basic.help.skip')}
${pre}voteskip --> ${t('basic.help.voteskip')}
${pre}qa name --> ${t('basic.help.qa')}
${pre}qrl --> ${t('basic.help.qrl')}
${pre}qra number --> ${t('basic.help.qra')}
${pre}queue --> ${t('basic.help.queue')}
${pre}np --> ${t('basic.help.np')}
${pre}random --> ${t('basic.help.random')}
${pre}rq number--> ${t('basic.help.rq')}
${pre}osu --> ${t('basic.help.osu')}
--------------------------------\`\`\``;
    var reply2 =`\`\`\`
${t('basic.help.youtube')}:
${pre}yts query --> ${t('basic.help.yts')}
${pre}ytq query --> ${t('basic.help.osu')}
--------------------------------
${t('basic.help.mod')}:
${t('basic.help.mod-info')}
${pre}info--> ${t('basic.help.info')}
${pre}ban @user --> ${t('basic.help.ban')}
${pre}kick @user --> ${t('basic.help.kick')}
${pre}rm 10 --> ${t('basic.help.rm')}
${pre}noLevelServer --> ${t('basic.help.noLevelServer')}
${pre}noPmServer --> ${t('basic.help.noPmServer')}
${pre}setLewd --> ${t('basic.help.setLewd')}
${pre}remLewd --> ${t('basic.help.remLewd')}
--------------------------------\`\`\``;
    var reply3 =
        `\`\`\`
${t('basic.help.other')}: 
${pre}r34 tags --> ${t('basic.help.r34')}
${pre}kona tags --> ${t('basic.help.kona')} 
${pre}e621 tags --> ${t('basic.help.e621')} 
${pre}yandere tags --> ${t('basic.help.yandere')}
${pre}level --> ${t('basic.help.level')}
${pre}rank --> ${t('basic.help.rank')} 
${pre}noLevel --> ${t('basic.help.noLevel')}
${pre}noPm --> ${t('basic.help.noPm')}
${pre}pp beatmaplink acc mods --> ${t('basic.help.pp')}
${pre}cookie @user --> ${t('basic.help.cookie')}
${pre}eatCookie --> ${t('basic.help.eatCookie')}
${pre}git --> ${t('basic.help.git')}
${pre}roll number --> ${t('basic.help.roll')}
${pre}8ball message --> ${t('basic.help.8ball')}
${pre}garfield --> ${t('basic.help.garfield')}
${t('basic.help.feedback')}
${t('basic.help.talk')}\`\`\``;
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