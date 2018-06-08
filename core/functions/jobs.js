const CronJob = require('cron').CronJob;

module.exports = {
    letsGameAlertJob: function(bot) {
        new CronJob({
            cronTime: '00 00 21 * * *',
            onTick: function() {
                bot.channels.get("446477206160408597").send("It's time to play boisss!");
            },
            start: false,
            timeZone: 'Asia/Tokyo'
        }).start();
    }
}