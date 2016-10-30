/**
 * Created by julia on 30.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var logger = require('../utility/logger');
var winston = logger.getT();
var cmd = 'ar';
var exec = (message) => {
    if (message.guild) {
        let Guild = message.dbServer;
        let messageSplit = message.content.split(' ').splice(1);
        winston.info(messageSplit);
        let mention = message.mentions.users.first();
        let wolkebot = messageHelper.hasWolkeBot(message);
        if (messageSplit.length > 0) {
            let roleGuild = message.guild.roles.filter(r => r.name === messageSplit[0]).first();
            if (Guild) {
                if (typeof (Guild.roles.length) !== 'undefined' && Guild.roles.length > 0) {
                    let role = messageHelper.checkRoleExist(messageSplit[0], Guild.roles);
                    if (role && roleGuild) {
                        if (role.self) {
                            if (!mention) {
                                message.member.addRole(roleGuild).then(member=> {
                                    message.channel.sendMessage(`Ok I just gave you the role ${role.name}!`);
                                }).catch(winston.error);
                            } else {
                                addRole(message, mention, roleGuild, wolkebot);
                            }
                        } else {
                            if (wolkebot) {
                                addRole(message, mention, roleGuild, wolkebot);
                            } else {
                                //no permission
                            }
                        }
                    } else {
                        if (roleGuild) {
                            if (wolkebot) {
                                addRole(message, mention, roleGuild, wolkebot);
                            } else {
                                //no permission
                            }
                        }
                    }
                } else {
                    if (wolkebot) {
                        if (roleGuild) {
                            if (!mention) {
                                addRole(message, message.author, roleGuild, wolkebot);
                            } else {
                                addRole(message, mention, roleGuild, wolkebot);
                            }
                        } else {
                            //role does not exist
                        }
                    }
                }
            }
        } else {

        }
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
function addRole(message, user, role, wolkebot) {
    if (wolkebot) {
        messageHelper.addRoleMember(message, user, role, (err) => {
            if (err) return message.reply(err);
            message.reply(':ok_hand: ')
        });
    } else {
        //no permission
    }
}
module.exports = {cmd: cmd, accessLevel: 0, exec: exec, cat: 'role'};