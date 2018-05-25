const http = require('http');

module.exports = {
    createServer: function(bot) {
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
    }
}