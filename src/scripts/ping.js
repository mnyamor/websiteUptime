/* An instance of ping will send GET http requests at regular intervals and log the results.
 * If the request fails, an email will be sent to you.
 */

//import modules
var request = require('request');
var statusCodes = require('http').STATUS_CODES;
var mailer = require('./mailer');

//PING CONSTRUCTOR

function Ping(opts) {
  //website to be monitored
  this.website = '';

  // ping intervals in minutes
  this.timeout = 15;

  //interval handler
  this.handle = null;

  //initialize the app 
  this.init(opts);

  return this;
}

//Methods

Ping.prototype = {
  init: function(opts) {
    var self = this;

    self.website = opts.website;
    self.timeout = (opts.timeout * (60 * 1000 ));

    //start monitoring
    self.start();
  },
  start: function() {
    var self = this;
    var time = Date.now();
    console.log("\nLoading... " + self.website + "\nTime: " + time + "\n");

    //create an interval for pings

    self.handle = setInterval(function() { 
      self.ping();
    }, self.timeout);

  },
  stop: function() {
    clearInterval(this.handle);
    this.handle = null;
  },
  ping: function() {
    var self = this;
    var currentTime = Date.now();

    try {
      //send request
       request( self.website, function( err, res, body) {
        if (!err && res.statusCode === 200 ) {
          self.isOk();
        }

        // No error but website was okay
        else if (!err) {
          self.isNotOk(res.statusCode);
        }
        else {
          self.isNotOk();
        }
       });
    }
    catch(err) {
      self.isNotOk();
    }
  },
  is0k: function() {
    this.log('UP', 'OK');
  },
  isNotOk: function() {
    var time =  Date.now(),
    self = this,
    time = self.getFormatedDate(time),
    msg = statusCodes[statusCode + ''],
    
    htmlMsg = '<p>Time: ' + time;
    htmlMsg +='</p><p>Website: ' + self.website;
    htmlMsg += '</p><p>Message: ' + msg + '</p>';
    this.log('DOWN', msg);
    
    // Send admin and email
    mailer({
      from: 'uptimedata@mail.com',
      to: 'mnyamor@gmail.com',
        subject: self.website + ' is down',
        body: htmlMsg
      }, function (error, res) {
        if (error) {
          console.log(error);
        }
        else {
          console.log(res.message || 'Failed to send email');
        }
    });
  },
 log: function (status, msg) {
        var self = this,
            time = Date.now(),
            output = '';
        output += "\nWebsite: " + self.website;
        output += "\nTime: " + time;
        output += "\nStatus: " + status;
        output += "\nMessage:" + msg  + "\n";
        console.log(output);
    },
    getFormatedDate: function (time) {
        var currentDate = new Date(time);
        currentDate = currentDate.toISOString();
        currentDate = currentDate.replace(/T/, ' ');
        currentDate = currentDate.replace(/\..+/, '');
        return currentDate;
    }
}
module.exports = Ping;



