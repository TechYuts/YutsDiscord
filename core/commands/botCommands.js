const appInfo = require('../../appinfo.json');
const request = require('request-promise');
const Discord = require('discord.js');

module.exports = {
    getFortniteStats: function(message, ign){
         let options = {
            method: 'GET',
            uri:`https://api.fortnitetracker.com/v1/profile/pc/${ign}`,
            headers: {
                'TRN-Api-Key': appInfo.fnTrackerKey
            },
            json:true
        };
        request(options).then(function (res){
            const embed = new Discord.RichEmbed();

            embed.setTitle('Fortnite stats');
            embed.setColor('#ff8dff');
            embed.setAuthor(ign, null, null);
            embed.setThumbnail("https://vignette.wikia.nocookie.net/fortnite/images/4/48/Items_VoucherBasic.png?size2048");
            embed.setFooter("Made by Yuts", "https://cdn.discordapp.com/embed/avatars/0.png");
            embed.addField("User", res.epicUserHandle, false);
            embed.addField("K/d", res.lifeTimeStats[11].value, true);
            embed.addField("kills", res.lifeTimeStats[10].value, true);
            embed.addField("Matches Played", res.lifeTimeStats[7].value, true);
            embed.addField("Wins", res.lifeTimeStats[8].value, true);
            message.channel.send(embed);
        }).catch(function (err) {
            console.log(err);
            message.channel.send("User doesn't Exist");
        });
    },

    getHelp: function(message) {
        message.channel.send("```?!info - get user info \n?!gee - let the bot choose the game for you. \n?!ping - just try \n?!fn (fortnite IGN) - get player stats. \n\nNote: This bot is extremely allergic to baj and reacts with salt every time he sends pm.```");
    },

    getRandomGames: function(message) {
        message.channel.send(`let's play ${_.sample(appInfo.gameList)}!`);
    },

    getUserInfo: function(message){
        const embed = new Discord.RichEmbed();

        embed.setTitle('User Info');
        embed.setColor('#00ff10');
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
}