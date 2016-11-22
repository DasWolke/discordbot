/**
 * Created by julia on 19.09.2016.
 */
const Discord = require('discord.js');
const config = require('./config/main.json');
var winston = require('winston');
var request = require("request");
let guilds = 0;
let users = 0;
if (!config.beta) {
    var StatsD = require('node-dogstatsd').StatsD;
    var dogstatsd = new StatsD();
}
let ShardManager = new Discord.ShardingManager('./index.js', {}, config.shards, true);
ShardManager.spawn(config.shards, 8000).then(shards => {
    winston.info('Spawned Shards!');
    timerFetchGuilds();
}).catch(winston.error);
function timerFetchGuilds() {
    winston.info('Fetching Guilds - timer!');
    setTimeout(() => {
        fetchGuilds();
        setInterval(() => {
            fetchGuilds();
        }, 1000 * 60 * 5);
    }, 1000 * 10);
}
function fetchGuilds() {
    winston.info('Fetching Guilds!');
    ShardManager.fetchClientValues('guilds.size').then(results => {
        ShardManager.broadcastEval('var x=0;this.guilds.map(g => {x += g.memberCount});x;').then(res => {
            winston.info(res);
            res = res.reduce((a, b) => a + b);
            users = res;
            winston.info('loaded guilds!');
            guilds = results.reduce((prev, val) => prev + val, 0);
            winston.info(`${results.reduce((prev, val) => prev + val, 0)} total guilds`);
            updateStats();
        }).catch(err => {
            winston.error(err);
        });
    }).catch(err => {
        winston.error(err);
    });
}
function updateStats() {
    if (!config.beta) {
        dogstatsd.gauge('musicbot.guilds', guilds);
        dogstatsd.gauge('musicbot.users', users);
    }
    let requestOptions = {
        headers: {
            Authorization: config.discord_bots_token
        },
        url: `https://bots.discord.pw/api/bots/${config.bot_id}/stats`,
        method: 'POST',
        json: {
            "server_count": guilds
        }
    };
    request(requestOptions, function (err, response, body) {
        if (err) {
            return winston.error(err);
        }
        winston.info('Stats Updated!');
        winston.info(body);
    });
    if (!config.beta) {
        let requestOptionsCarbon = {
            url: `https://www.carbonitex.net/discord/data/botdata.php`,
            method: 'POST',
            json: {
                "server_count": guilds,
                "key": config.carbon_token
            }
        };
        request(requestOptionsCarbon, function (err, response, body) {
            if (err) {
                return winston.error(err);
            }
            winston.info('Stats Updated Carbon!');
            winston.info(body);
        });
    }
}