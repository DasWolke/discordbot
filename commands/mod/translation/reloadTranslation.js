/**
 * Created by julia on 02.10.2016.
 */
var i18nBean = require('../../../utility/i18nManager');
var cmd = 'reload';
var config = require('../../../config/main.json');
var execute = function (message) {
    if (message.author.id === config.owner_id) {
        try {
            var i18next = require('i18next');
            var Backend = require('i18next-node-fs-backend');
            var backendOptions = {
                loadPath: 'locales/{{lng}}/{{ns}}.json',
                addPath: 'locales/{{lng}}/{{ns}}.missing.json',
                jsonIndent: 2
            };
            i18next.use(Backend).init({
                whitelist: ['en', 'de', 'ru'],
                backend: backendOptions,
                lng: 'en',
                fallbacklngs: false,
                preload: ['de', 'en', 'ru']
            }, (err, t) => {
                if (err) {
                    return message.reply(err);
                }
               i18nBean.setT(t);
                message.reply('Reloaded Translation!')
            });
        } catch (e) {
            return message.reply(e);
        }
    }
};
module.exports = {cmd:cmd, accessLevel:0, exec:execute};