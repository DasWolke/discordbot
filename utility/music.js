/**
 * Created by julia on 01.10.2016.
 */
var songModel = require('../DB/song');
var YoutubeReg = /(?:http?s?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]+)(&.*|)/;
var SoundcloudReg = /(?:http?s?:\/\/)?(?:www\.)?(?:soundcloud\.com|snd\.sc)\/(?:.*)/;
var createSong = function (title, alt_title, id, addedBy, duration, url, dl, path, proxy, setId) {
    return new Promise((resolve, reject) => {
        let song = new songModel({
            title: title,
            alt_title: alt_title,
            id: id,
            addedBy: addedBy,
            addedAt: new Date(),
            duration: duration,
            type: "audio/mp3",
            url: url,
            dl: dl,
            dlBy: proxy,
            cached: true,
            cachedAt: new Date(),
            cachedUntil: new Date(),
            path: path,
            setId:setId
        });
        song.save((err) => {
            if (err) return reject(err);
            resolve(song);
        })
    });
};
var checkOsuMap = function (url) {
    let setRegex = /(?:http(?:s|):\/\/osu.ppy.sh\/(s|b)\/([0-9]*)((\?|\&)m=[0-9]|))/;
    return(!!setRegex.test(url));
};
var checkMedia = function (url) {
        if (YoutubeReg.test(url)) {
            return true;
        } else {
            return !!SoundcloudReg.test(url);
        }
};
module.exports = {
    createSong: createSong,
    checkOsuMap: checkOsuMap,
    checkMedia: checkMedia,
    ytRegex: YoutubeReg,
    scRegex: SoundcloudReg
};