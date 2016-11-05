/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../../../utility/i18nManager');
var cmd = 'reload';
var config = require('../../../config/main.json');
var logger = require('../../../utility/logger');
var fs = require("fs");
var winston = logger.getT();
var execute = function (message) {
    if (message.author.id === config.owner_id) {
        try {
            getDirs('locales/', (list) => {
                var i18next = require('i18next');
                var Backend = require('i18next-node-fs-backend');
                var backendOptions = {
                    loadPath: 'locales/{{lng}}/{{ns}}.json',
                    addPath: 'locales/{{lng}}/{{ns}}.missing.json',
                    jsonIndent: 2
                };
                i18next.use(Backend).init({
                    backend: backendOptions,
                    lng: 'en',
                    fallbacklngs: false,
                    preload: list,
                    load: 'all'
                }, (err, t) => {
                    if (err) {
                        return message.reply(err);
                    }
                    i18nBean.setT(t);
                    message.reply('Reloaded Translation!')
                });
            });
        } catch (e) {
            return message.reply(e);
        }
    }
};
function getDirs(rootDir, cb) {
    fs.readdir(rootDir, function (err, files) {
        var dirs = [];
        for (var index = 0; index < files.length; ++index) {
            var file = files[index];
            if (file[0] !== '.') {
                var filePath = rootDir + '/' + file;
                fs.stat(filePath, function (err, stat) {
                    if (stat.isDirectory()) {
                        dirs.push(this.file);
                    }
                    if (files.length === (this.index + 1)) {
                        return cb(dirs);
                    }
                }.bind({index: index, file: file}));
            }
        }
    });
}
module.exports = {cmd: cmd, accessLevel: 0, exec: execute};