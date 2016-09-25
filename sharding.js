/**
 * Created by julia on 19.09.2016.
 */
const Discord = require('discord.js');
const config = require('./config/main.json');
let ShardManager = new Discord.ShardingManager('./index.js', config.shards, true);
let Shards = ShardManager.spawn(config.shards, 1000);
// ShardManager.fetchClientValues('guilds.size').then(results => {
//     console.log(`${results.reduce((prev, val) => prev + val, 0)} total guilds`);
// }).catch(console.error);