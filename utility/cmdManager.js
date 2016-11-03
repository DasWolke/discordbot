/**
 * Created by julian on 16.05.2016.
 */
var commands = {};
const fs = require('fs');
const path = require('path');
var logger = require('./logger');
var winston = logger.getT();
var config = require('../config/main.json');
commands.load = {};
commands.load.cat = 'admin';
commands.load.cmd = "load";
commands.load.accessLevel = 2;
commands.load.exec = function (msg) {
    if (msg.author.id == config.owner_id) {
        var args = msg.content.split(' ')[1];
        try {
            delete commands[args];
            delete require.cache[path.join(__dirname, '../commands/', `${args}.js`)];
            let cmd = require(path.join(__dirname, '../commands/', `${args}.js`));
            commands[cmd.cmd] = cmd;
            msg.channel.sendMessage('Loaded ' + args);
        } catch (err) {
            msg.channel.sendMessage("Command not found or error loading\n`" + err.message + "`");
        }
    }
};

commands.unload = {};
commands.unload.cat = 'admin';
commands.unload.cmd = "unload";
commands.unload.accessLevel = 2;
commands.unload.exec = function (msg) {
    if (msg.author.id == config.owner_id) {
        var args = msg.content.split(' ')[1];
        try {
            delete commands[args];
            delete require.cache[path.join(__dirname, '../commands/', `${args}.js`)];
            msg.channel.sendMessage('Unloaded ' + args);
        }
        catch (err) {
            msg.channel.sendMessage("Command not found");
        }
    }
};

commands.reload = {};
commands.reload.cat = 'admin';
commands.reload.accessLevel = 2;
commands.reload.cmd = "reload";
commands.reload.exec = function (msg) {
    if (msg.author.id == config.owner_id) {
        var args = msg.content.split(' ')[1];
        try {
            delete commands[args];
            delete require.cache[path.join(__dirname, '../commands/', `${args}.js`)];
            let cmd = require(path.join(__dirname, '../commands/', `${args}.js`));
            commands[cmd.cmd] = cmd;
            msg.channel.sendMessage('Reloaded ' + args);
        }
        catch (err) {
            msg.channel.sendMessage("Command not found");
        }
    }
};
var init = function () {
    loadCommands();
};
var loadCommands = function () {
    fs.readdir(path.join(__dirname, '../commands'), (err, files) => {
        for (let file of files) {
            if (file.endsWith('.js')) {
                var command = require(path.join(__dirname, '../commands/', file));
                commands[command.cmd] = command;
            }
        }
        winston.info('Loaded Commands');
        saveCommands(commands);
    });
};
var getCommands = function () {
    return commands;
};
var saveCommands = function (t) {
    commands = t;
};
var checkCommand = function (msg) {
    try {
        let command = msg.content.substr(msg.prefix.length).split(' ')[0];
        let accessLevel = commands[command].accessLevel;
        let userAccessLevel = 2;
        if (userAccessLevel >= accessLevel) {
            commands[command].exec(msg);
        } else {
            msg.reply(`Your current access level of ${userAccessLevel} is not enough for the needed accesslevel of ${accessLevel}`)
        }
    }
    catch (err) {
        winston.error(err.message);
        winston.error(err.stack);
    }
};
module.exports = {
    init: init,
    checkCommand: checkCommand,
    loadCommands: loadCommands,
    getCommands: getCommands,
    saveCommands: saveCommands
};