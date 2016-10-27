/**
 * Created by julia on 02.10.2016.
 */
var cmd = 'rem';
var path = require('path');
var logger = require('../utility/logger');
var winston = logger.getT();
var generalHelper = require('../utility/general');
const fs = require('fs');
const imagePath = '../remImages/';
var execute = function (message) {
    //TODO remove when fixed
    fs.readdir(path.join(__dirname, imagePath), (err, files) => {
        if (err) return winston.error(err);
        let number = generalHelper.random(0, files.length - 1);
        message.channel.sendFile(path.join(__dirname, '../remImages/' + files[number]), '', '\u200B').then(message => {

        }).catch(winston.info);
    });
};
module.exports = {cmd: cmd, accessLevel: 0, exec: execute, cat: 'misc'};