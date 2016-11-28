var newMessage = process.argv[2];

function writeLogFile(message) {
  if(message == null) {
    var message = newMessage;
  }
  var fs = require('fs');
  var today = Date.now();
  fs.appendFile('./logs/log.txt', today + '\n' + message, 'utf8', function(err) {
    if(err) {
      console.log('Whoops! ' + err);
    } else {
      console.log('Success!');
    }
  });
}

writeLogFile();
module.exports = writeLogFile;
