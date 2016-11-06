/**
 * Created by julia on 30.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var logger = require('../utility/logger');
var serverModel = require('../DB/server');
var winston = logger.getT();
var cmd = 'cr';
var _ = require('lodash');
var minimist = require('minimist');
var exec = (message) => {
    if (message.guild) {
        let wolkebot = messageHelper.hasWolkeBot(message);
        if (wolkebot) {
            let messageSplit = message.content.split(' ').splice(1);
            let res = parseArguments(messageSplit);
            let role = res.arguments;
            winston.info(JSON.stringify(role));
            if (messageSplit.length > 0) {
                let roleGuild = message.guild.roles.filter(r => r.name === role.name).first();
                if (roleGuild) {
                    role.id = roleGuild.id;
                    if (typeof (message.dbServer.roles) !== 'undefined' && message.dbServer.roles.length > 0) {
                        let roles = _.filter(message.dbServer.roles, {id: roleGuild.id});
                        if (roles.length > 0) {
                            message.reply(':no_entry_sign: ');
                        } else {
                            winston.info(role);
                            message.dbServer.addRole(role, (err) => {
                                if (err) return message.reply(t('generic.error', {lngs: message.lang}));
                                message.reply(`Ok, I just added the role ${role.name} `);
                            })
                        }
                    } else {
                        message.dbServer.addRole(role, (err) => {
                            if (err) return message.reply(t('generic.error', {lngs: message.lang}));
                            message.reply(`Ok, I just added the role ${role.name}`);
                        })
                    }
                } else {
                    message.guild.createRole({name: role.name, permissions: 0}).then(roleServer => {
                        role.id = roleServer.id;
                        message.dbServer.addRole(role, (err) => {
                            if (err) return message.reply(t('generic.error', {lngs: message.lang}));
                            message.reply(`Ok, I just added the role ${role.name}`);
                        });
                    }).catch(err => winston.error(err));
                }
            } else {
                message.reply(':no_entry_sign: ');
            }
        } else {
            message.reply(t('generic.no-permission', {lngs: message.lang}));
        }
    } else {
        message.reply(t('generic.no-pm', {lngs: message.lang}));
    }
};
var parseArguments = (contentSplit) => {
    let arguments = {self: false, default: false, level: -1};
    let args = minimist(contentSplit, {boolean: ['d', 's']});
    console.log(args);
    if (typeof (args.s) !== 'undefined' && args.s) {
        arguments.self = true;
    }
    if (typeof (args.d) !== 'undefined' && args.d) {
        arguments.default = true;
    }
    if (typeof (args.l) !== 'undefined' && args.l) {
        let l = args.l;
        let number = -1;
        if (typeof (l) !== 'undefined') {
            try {
                number = parseInt(l);
            } catch (e) {

            }
            if (isNaN(l)) {
                number = -1;
            }
            if (l < 2) {
                number = -1;
            }
            arguments.level = number;
        }
    }
    arguments.name = args._.join(' ').trim();
    return {arguments: arguments};
};
module.exports = {cmd: cmd, accessLevel: 0, exec: exec, cat: 'roles'};