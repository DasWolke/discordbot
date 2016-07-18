/**
 * Created by julian on 16.05.2016.
 */
var basic = require('./commands/basic');
var music = require('./commands/music/music');
var playlist = require('./commands/playlist');
var cleverbot = require('./commands/cleverbot');
var permissions = require('./commands/permissions');
var osu = require('./commands/osuNoMusic');
module.exports = {basic:basic, music:music, playlist:playlist, cleverbot:cleverbot, permission:permissions, osuNoMusic:osu};