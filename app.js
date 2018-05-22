
const Discord = require('discord.js');
const logger = require('winston');
const auth = require('./auth.json');
const request = require('request-promise');
const appinfo = require('./appinfo.json');
const http = require('http');

const PREFIX = "?!"
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
    console.dir(req.param);

    if (req.method == 'POST') {
        console.log("POST");
        var body = '';
        req.on('data', function (data) {
            body += data;
            console.log("Body: " + body);
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

bot.on('message', function(message) {
    if (message.author.equals(bot.user)) return;

    if (!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");

    switch(args[0].toLowerCase()){
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
                    'Client-ID': appinfo.clientID
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
            //         secret: appinfo.secret
            //     },
            //     json:true
            // };
            // request(options).then(function(res){
            //
            // }).catch(function(err){
            //
            // });

            break;
    }
});

bot.login(auth.token);

