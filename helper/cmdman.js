/**
 * Created by julian on 16.05.2016.
 */
var basic = require('./commands/basic');
var music = require('./commands/music/music');
var playlist = require('./commands/playlist');
var cleverbot = require('./commands/cleverbot');
var permissions = require('./commands/permissions');
var osu = require('./commands/osuNoMusic');
var youtube = require('./commands/music/youtube');
var moderation = require('./commands/moderation');
var hentai = require('./commands/lewd');
var proxer = require('./commands/proxer');
module.exports = {
    basic: basic,
    music: music, youtube: youtube,
    playlist: playlist,
    cleverbot: cleverbot,
    permission: permissions,
    osuNoMusic: osu,
    moderation: moderation,
    hentai:hentai,
    proxer:proxer
};