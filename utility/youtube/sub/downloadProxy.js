var fs = require("fs");
var request = require("request");
var winston = require('winston');
var songModel = require('../../../DB/song');
var mongoose = require("mongoose");
var config = require('../../../config/main.json');
let url;
if (config.beta) {
    url = 'mongodb://localhost/discordbot-beta';
} else {
    url = 'mongodb://localhost/discordbot';
}
mongoose.connect(url, (err) => {
    if (err) {
        return winston.error("Unable to connect to Mongo Server!");
    }
});
process.on('message', (m) => {
    downloadProxy(m.url, m.author, 1, (err, info) => {
        process.send({err: err, info: info});
    })
});
var downloadProxy = function (url, authorId, proxy, cb) {
    let proxy_url;
    if (proxy === 0) {
        proxy_url = "http://localhost:7005";
    } else if (proxy === 1) {
        proxy_url = config.dl_url_1;
    } else {
        proxy_url = config.dl_url_2;
    }
    let options = {
        url: `${proxy_url}/api/dl`,
        headers: {
            auth: config.dl_token
        },
        form: {
            url: url
        },
        method: 'POST',
        timeout: 240000
    };
    request(options, (error, response, body) => {
        if (error) {
            // client.captureMessage(error, {extra: {'url': url, 'proxy': proxy}});
            return cb(error);
        }
        let parsedBody = {error: 1};
        try {
            parsedBody = JSON.parse(body);
        } catch (e) {
            // client.captureMessage(e, {extra: {'url': url, 'proxy': proxy, 'json': body}});
        }
        console.log(parsedBody);
        if (parsedBody.error === 0) {
            winston.info(parsedBody.path);
            winston.info(`${proxy_url}${parsedBody.path}`);
            var stream = request(`${proxy_url}/${parsedBody.path}`).on('error', (err) => {
                return cb(err);
            }).pipe(fs.createWriteStream(`audio/${parsedBody.info.id}.mka`));
            stream.on('finish', () => {
                var song = new songModel({
                    title: parsedBody.info.title,
                    alt_title: parsedBody.info.alt_title,
                    id: parsedBody.info.id,
                    addedBy: authorId,
                    addedAt: Date.now(),
                    duration: convertDuration(parsedBody.info),
                    type: "audio/mka",
                    url: url,
                    dl: "stream",
                    dlBy: `proxy_${proxy}`,
                    cached: true,
                    cachedAt: new Date(),
                    path: `audio/${parsedBody.info.id}.mka`
                });
                song.save((err) => {
                    if (err) return cb(err);
                    cb(null, parsedBody.info);
                });
            });
        } else {
            if (proxy === 2) {
                // client.captureMessage('The Proxy did not work.', {
                //     extra: {
                //         'url': url,
                //         'proxy': proxy,
                //         'guild': message.guild.name
                //     }
                // });
                return cb('The Proxy did not work.');
            } else {
                downloadProxy(url, authorId, proxy + 1, cb);
            }
        }
    });
};
var convertDuration = function (info) {
    let durationConv = "";
    if (typeof (info.duration) === 'undefined' && typeof (info.length_seconds) === 'undefined') {
        // client.captureMessage('Duration undefined!', {extra: {'info': info}});
    }
    if (typeof (info.duration) !== 'undefined') {
        let durationSplit = info.duration.split(':');
        for (var i = 0; i < durationSplit.length; i++) {
            if (i !== durationSplit.length - 1) {
                if (durationSplit[i].length === 1) {
                    durationConv = durationConv + '0' + durationSplit[i] + ':';
                } else {
                    durationConv = durationConv + durationSplit[i] + ':';
                }
            } else {
                if (durationSplit[i].length === 1) {
                    durationConv = durationConv + '0' + durationSplit[i];
                } else {
                    durationConv = durationConv + durationSplit[i];
                }
            }
        }
        winston.info(durationConv);
    } else {
        let d = Number(info.length_seconds);
        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);
        return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s);
    }
    return durationConv;
};