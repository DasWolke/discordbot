/**
 * Created by julia on 05.09.2016.
 */
var userModel = require('../../../DB/user');
var login = require('./login');
var getInfo = require('./getUserInfo');
var sendMessage = require('./sendMessage');
var verify = function(discordId, proxerId) {
    console.log(discordId);
    console.log(proxerId);
    login(function (err, body) {
        if (err) return console.log(err);
        console.log(body);
        const token = body.data.token;
        getInfo(proxerId, token, function (err, data) {
            if (err) {
                return console.log(err);
            }
            if (typeof (data.username) !== 'undefined' && data.username !== '') {
                var verificationToken = Math.floor((Math.random() * 1000) + (Math.random() * 1000));
                sendMessage(data.username, `Dein Verifizierungstoken für den Proxer Discord: ${verificationToken}`, token, function (err, data) {
                    if (err) return console.log(err);
                    userModel.update({id:discordId}, {$set:{verificationToken:verificationToken, proxerId:proxerId}}, function (err) {
                        if (err) return console.log(err);

                    });
                });
            } else {
                console.log('Username is undefined!');
            }
        });
    });

};
module.exports = verify;