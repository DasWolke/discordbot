/**
 * Created by julia on 05.09.2016.
 */
var userModel = require('../../../DB/user');
var login = require('./../login/login');
var getInfo = require('./../messenger/getUserInfo');
var sendMessage = require('./../messenger/sendMessage');
var verify = function (discordId, proxerId, cb) {
    login(function (err, body) {
        if (err) return cb(err);
        const token = body.data.token;
        getInfo(proxerId, token, function (err, data) {
            if (err) {
                return cb(err);
            }
            if (typeof (data.username) !== 'undefined' && data.username !== '') {
                let proxer_name = data.username;
                var verificationToken = Math.floor((Math.random() * 1000) + (Math.random() * 1000));
                sendMessage(data.username, `Dein Verifizierungstoken für den Proxer Discord: ${verificationToken}`, token, function (err, data) {
                    if (err) return cb(err);
                    userModel.update({id: discordId}, {
                        $set: {
                            verificationToken: verificationToken,
                            proxerId: proxerId
                        }
                    }, function (err) {
                        if (err) return cb(err);
                        cb(null, data, proxer_name);
                    });
                });
            } else {
                cb('Username is undefined!');
            }
        });
    });

};
module.exports = verify;