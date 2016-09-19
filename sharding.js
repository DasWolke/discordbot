/**
 * Created by julia on 19.09.2016.
 */
const Discord = require('discord.js');
const ShardManager = new Discord.ShardingManager('./index.js');
ShardManager.spawn(4);