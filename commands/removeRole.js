/**
 * Created by julia on 30.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var logger = require('../utility/logger');
var winston = logger.getT();
var messageHelper = require("../utility/message.js");
var cmd = 'rr';
var exec = (message) => {
    if (message.guild) {
        let Guild = message.dbServer;
        let userReg = /<@[0-9]+>/g;
        let content = message.content.substr(message.prefix.length + cmd.length).trim();
        content = content.replace(userReg, '').trim();
        winston.info(content);
        let mention = message.mentions.users.first();
        let wolkebot = messageHelper.hasWolkeBot(message);
        if (content.length > 0) {
            let roleGuild = message.guild.roles.filter(r => r.name === content).first();
            if (Guild) {
                if (typeof (Guild.roles.length) !== 'undefined' && Guild.roles.length > 0) {
                    let role = messageHelper.checkRoleExist(content, Guild.roles);
                    if (role && roleGuild) {
                        if (role.self) {
                            if (!mention) {
                                message.member.removeRole(roleGuild).then(member=> {
                                    message.channel.sendMessage(`Ok I just removed the role ${role.name} of ${user} !`);
                                }).catch(winston.error);
                            } else {
                                remRole(message, mention, roleGuild, wolkebot);
                            }
                        } else {
                            if (wolkebot) {
                                remRole(message, mention, roleGuild, wolkebot);
                            } else {
                                message.reply(t('generic.no-permission', {lngs: message.lang}));
                            }
                        }
                    } else {
                        if (roleGuild) {
                            if (wolkebot) {
                                remRole(message, mention, roleGuild, wolkebot);
                            } else {
                                message.reply(t('generic.no-permission', {lngs: message.lang}));
                            }
                        }
                    }
                } else {
                    if (wolkebot) {
                        if (roleGuild) {
                            if (!mention) {
                                remRole(message, message.author, roleGuild, wolkebot);
                            } else {
                                remRole(message, mention, roleGuild, wolkebot);
                            }
                        } else {
                            message.channel.sendMessage('No Role in Guild found uwu');
                        }
                    } else {
                        message.reply(t('generic.no-permission', {lngs: message.lang}));
                    }
                }
            }
        } else {

        }
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
function remRole(message, user, role, wolkebot) {
    if (wolkebot) {
        messageHelper.remRoleMember(message, user, role, (err) => {
            if (err) return message.reply(err);
            message.channel.sendMessage(`Ok I just removed the role ${role.name} of ${user} !`);
        });
    } else {
        message.reply(t('generic.no-permission', {lngs: message.lang}));
    }
}
module.exports = {
    cmd: 'rr', accessLevel: 0, exec: exec, cat: 'roles'
};