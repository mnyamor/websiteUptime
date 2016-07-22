var Ping = require('./src/scripts/ping');
var websites = require('./src/scripts/websites');
var http = require('http');
var server;
var port = process.env.PORT  || 3008;
var monitors = [];

websites.forEach(function (website) {
    var monitor = new Ping ({
        website: website.url,
        timeout: website.timeout
    });
    monitors.push(monitor);
});

server = http.createServer(function (req, res) {
  var data = 'Monitoring the following websites: \n \n' + websites.join('\n');
  res.end(data);
});

server.listen(port);
console.log("Listening to port %s", port);