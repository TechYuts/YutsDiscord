const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const request = require('request-promise');
const appInfo = require('./appinfo.json');
const CronJob = require('cron').CronJob;
const botCommands = require('./core/commands/botCommands.js');
const webhook = require('./core/webhook/webhook.js');

let options;
const PREFIX = "?!";
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';
// Initialize Discord Bot
const bot = new Discord.Client();

//http post server
webhook.createServer(bot);

bot.on('ready', function() {
    console.log("connected!");
});

// cron
const job = new CronJob({
    cronTime: '00 00 21 * * *',
    onTick: function() {
        bot.channels.get("446477206160408597").send("It's time to play boisss!");
    },
    start: false,
    timeZone: 'Asia/Tokyo'
});
job.start();

bot.on('message', function(message) {
    if (message.author.equals(bot.user)) return;
    
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0].toLowerCase()){
        case "help":
            botCommands.getHelp(message);
            break;
        case "info":
            botCommands.getUserInfo(message);
            break;
        case "gee":
            botCommands.getRandomGames(message);
            break;
        case "ping":
            console.log(`Executed ${args[0]}`);
            message.channel.send("Pong!");
            break;

        case "twitch":

            if (args[1] === undefined) return;

            let twitchID;

            options = {
                method: 'GET',
                uri:'https://api.twitch.tv/helix/users',
                qs: {
                    login: args[1]
                },
                headers: {
                    'Client-ID': appInfo.clientID
                },
                json:true
            };

            request(options).then(function (res){
                twitchID = res.data[0].id;
                message.channel.send(`The twitch ID is:${res.data[0].id}`);
            }).catch(function(err){
                console.log(err);
        });
            //  options = {
            //     method:'POST',
            //     uri:'https://api.twitch.tv/helix/webhooks/hub',
            //     body: {
            //         callback: 'link to webhook listener',
            //         topic: `https://api.twitch.tv/helix/users/streams?user_id=${twitchID}`,
            //         mode: 'subscribe',
            //         lease_seconds: 864000,
            //         secret: appInfo.secret
            //     },
            //     json:true
            // };
            // request(options).then(function(res){
            //
            // }).catch(function(err){
            //
            // });
            break;

        case "fn":
            botCommands.getFortniteStats(message, args[1]);
            break;
    }
});

bot.login(auth.token);

