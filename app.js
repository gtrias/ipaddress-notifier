var config        = require('config');
var TelegramBot   = require('node-telegram-bot-api');
var tgtoken       = config.get('telegram.token');
var tgNotifyUsers = config.get('telegram.notifyUsers');
const getIP       = require('external-ip')();

var tgBot = new TelegramBot(tgtoken, { polling: true });

var lastIp

function listeningChanges() {
  getIP((err, ip) => {
    if (err) {
      // every service in the list has failed
      return console.log('An error happened %j', err);
    }

    if (lastIp !== ip) {
      notify(ip);
      lastIp = ip;
    }
  });
}

// send notification to tg
function notify(msg) {
  // Telegram sending
  for (var i = 0; i < tgNotifyUsers.length; i++) {
    tgBot.sendMessage(tgNotifyUsers[i], msg);
  }
}

// Start app
listeningChanges()
setInterval(listeningChanges, 1800000);
