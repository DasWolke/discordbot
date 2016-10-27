/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'lewd';
var lewd = require('../config/lewd.json');
var generalHelper = require('../utility/general');
var path = require('path');
var logger = require('../utility/logger');
var winston = logger.getT();
const fs = require('fs');
const imagePath = '../lewdImages/';
var execute = function (message) {
    //TODO remove when fixed
    fs.readdir(path.join(__dirname, imagePath), (err, files) => {
        if (err) return winston.error(err);
        let number = generalHelper.random(0, files.length - 1);
        message.channel.sendFile(path.join(__dirname, '../lewdImages/' + files[number]), '', '\u200B').then(message => {

        }).catch(winston.info);
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};