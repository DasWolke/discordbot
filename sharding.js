/**
 * Created by julia on 19.09.2016.
 */
const Discord = require('discord.js');
const config = require('./config/main.json');
let ShardManager = new Discord.ShardingManager('./index.js', config.shards);
ShardManager.spawn(config.shards);