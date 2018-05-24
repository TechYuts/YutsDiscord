const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const request = require('request-promise');
const appInfo = require('./appinfo.json');
const http = require('http');
const _ = require('lodash');
const CronJob = require('cron').CronJob;

const PREFIX = "?!";
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client();

//http post server
var server = http.createServer( function (req, res) {
    if (req.method == 'POST') {

        let body = '';
        req.on('data', function (reqBody) {
            body = JSON.parse(reqBody)
            if (body.data[0].user_id !== undefined) {
                console.log(body.data[0].user_id);
                bot.channels.get("446477206160408597").send(`User: ${body.data[0].user_id} has started Streaming!`);
            }
        });
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end('post received');
    }
});

port = 3000;
host = '127.0.0.1';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);
// http post server end

bot.on('ready', function() {
    console.log("connected!");
});

// cron
var job = new CronJob({
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

    var salt = bot.emojis.find("name","salt");

    if (message.author.equals(bot.users.find("id","393300171485609984"))) {
        message.react(salt);
    };

    if (message.content.toLowerCase().includes("baj") || message.content.toLowerCase().includes("dot")) {
        message.channel.send(`${salt} ${salt} ${salt}`);
    }

    if (message.content.includes("kim")) {
        message.channel.send(`Move on move on din boiii, ${salt} ${salt} ${salt}`);
    }

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0].toLowerCase()){
        case "info": {
            const embed = new Discord.RichEmbed();

            embed.setTitle('User Info');
            embed.setColor('#ff8d00');
            embed.setAuthor(message.author.username, null, null);
            embed.setThumbnail(message.author.avatarURL);
            embed.setFooter("Made by Yuts", "https://cdn.discordapp.com/embed/avatars/0.png");
            embed.addField("User", message.author.username, true);
            embed.addField("ID", message.author.id, true);
            embed.addField("Created", message.author.createdAt, true);
            // embed.addField("Roles", _.map(message.member.roles, 'name').join(', '),false);
            // console.log(message.member.roles.map());
            message.channel.send(embed);
        }
            break;
        case "gee":
            message.channel.send(`let's play ${_.sample(appInfo.gameList)}!`);
            break;
        case "ping":
            console.log(`Executed ${args[0]}`);
            message.channel.send("Pong!");
            break;

        case "createhook":
            console.log(`Executed ${args[0]}`);
            message.channel.createWebhook("Sample Webhook", "https://i.imgur.com/p2qNFag.png")
                .then(wb => message.author.send(`Here is your webhook https://canary.discordapp.com/api/webhooks/${wb.id}/${wb.token}`))
                .catch(console.error);
            break;

        case "twitch":

            if (args[1] === undefined) return;

            let twitchID;

            let options = {
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
        case "channel":
            console.log(message.channel.id);
            message.channel.send(`This Channel ID is: ${message.channel.id}`);
            break;
    }
});

bot.login(auth.token);

