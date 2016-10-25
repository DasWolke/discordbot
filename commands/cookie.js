/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../utility/i18nManager');
var t = i18nBean.getT();
var messageHelper = require('../utility/message');
var voice = require('../utility/voice');
var logger = require('../utility/logger');
var userModel = require('../DB/user');
var winston = logger.getT();
var config = require('../config/main.json');
var cmd = 'cookie';
var execute = function (message) {
    if (message.guild) {
        let messageSplit = message.content.split(' ');
        if (typeof (messageSplit[1]) !== 'undefined') {
            let user = message.mentions.users.first();
            if (user) {
                userModel.findOne({id: user.id}, function (err, User) {
                    if (err) return winston.info(err);
                    if (User) {
                        if (messageHelper.hasGuild(message, User)) {
                            var clientServer = messageHelper.loadServerFromUser(message, User);
                            if (typeof (clientServer.cookies) !== 'undefined') {
                                userModel.update({
                                    id: User.id,
                                    'servers.serverId': message.guild.id
                                }, {$inc: {'servers.$.cookies': 1}}, function (err) {
                                    if (err) return winston.info(err);
                                    message.channel.sendMessage(t('cookie.give', {
                                        lngs: message.lang,
                                        user: User.name
                                    }));
                                });
                            } else {
                                userModel.update({
                                    id: User.id,
                                    'servers.serverId': message.guild.id
                                }, {$inc: {'servers.$.cookies': 1}}, function (err) {
                                    if (err) return winston.info(err);
                                    message.channel.sendMessage(t('cookie.give', {
                                        lngs: message.lang,
                                        user: User.name
                                    }));
                                });
                            }
                        } else {
                            User.addServer(messageHelper.getServerObj(message, true, true), function (err) {
                                if (err) return winston.info(err);
                            });
                        }
                    } else {
                        messageHelper.createUser({author: user, guild: message.guild}, true, true, function (err) {
                            if (err) return winston.info(err);
                            userModel.findOne({id: user.id}, function (err, User) {
                                if (err) return winston.info(err);
                                if (User) {
                                    var clientServer = messageHelper.loadServerFromUser(message, User);
                                    if (typeof (clientServer.cookies) !== 'undefined') {
                                        userModel.update({
                                            id: User.id,
                                            'servers.serverId': message.guild.id
                                        }, {$inc: {'servers.$.cookies': 1}}, function (err) {
                                            if (err) return winston.info(err);
                                            message.channel.sendMessage(t('cookie.give', {
                                                lngs: message.lang,
                                                user: User.name
                                            }));
                                        });
                                    } else {
                                        var server = messageHelper.getServerObj(message, true, true);
                                        User.addServer(server, function (err) {
                                            if (err) return winston.info(err);
                                            message.channel.sendMessage(t('cookie.new-server', {lngs: message.lang}));
                                        });
                                    }
                                } else {
                                    message.channel.sendMessage(t('cookie.arere', {lngs: message.lang}));
                                }
                            });
                        });
                    }
                });
            } else {
                message.channel.sendMessage(t('cookie.one-user', {lngs: message.lang}));
            }
        } else {
            userModel.findOne({id: message.author.id, 'servers.serverId': message.guild.id}, function (err, User) {
                if (err) return winston.info(err);
                if (User) {
                    var clientServer = messageHelper.loadServerFromUser(message, User);
                    if (typeof (clientServer.cookies) !== 'undefined') {
                        message.reply(t('cookie.count', {lngs: message.lang, number: clientServer.cookies}));
                    } else {
                        message.reply(t('cookie.count', {lngs: message.lang, number: 0}))
                    }
                } else {
                    messageHelper.createUser(message, true, true, function (err) {
                        if (err) return winston.info(err);
                    });
                    message.reply(t('cookie.count', {lngs: message.lang, number: 0}));
                }
            });
        }
    } else {
        message.channel.sendMessage(t('generic.no-pm', {lngs: message.lang}));
    }
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};