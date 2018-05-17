
var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');

const PREFIX = "?!"
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('message', function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0].toLowerCase()){ 
        case "ping":
            message.channel.send("Pong!")
            break;
    }
});

bot.login(auth.token);
