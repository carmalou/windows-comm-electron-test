// module.exports = function convertFiles() {
  var logIt = require('./writeLogs.js');

  var fs = require('fs');
  var os = require('os');
  var path = require('path');
  var ws = require('windows-shortcuts');
  var appName = require('./src/package.json').name; // this needs to be changed, as this module will be included in src
  var appPath = os.homedir() + '\\AppData\\Local\\' + appName;
  var driveName = process.env.HOMEDRIVE; // grab the home drive to be able to get to ProgramFiles without issue
  var programFilePath = driveName + '\\Program Files (x86)\\';

  function readAppData() {
    fs.readdir(appPath, function(err, files) {
      if(err) {
        console.log('Whoops! ', err);
      } else {
        console.log('files ', files);
        var tmpArr = files.filter(onlyAppNames);
        getNewestDir(tmpArr);
      }
    });
  };

  function onlyAppNames(file) {  // filter out files that don't include 'app' and aren't a directory
    var newReg = /app/;
    return newReg.test(file) && fs.statSync(appPath + '\\' + file).isDirectory();
  }

  function getNewestDir(directory) {
    var tmpArr = [];
    function compareVals(a, b) {
      return a - b;
    }
    
    for(var i = 0; i < directory.length; i++) {
      var tmpObj = {};
      var tmpVar = fs.statSync(appPath + '\\' + directory[i]).birthtime;
      tmpVar = new Date(tmpVar).getTime();
      tmpObj.name = directory[i];
      tmpObj.time = tmpVar;
      tmpArr.push(tmpObj);
    }
    tmpArr = tmpArr.sort(compareVals);
    editShortcut(tmpArr[tmpArr.length-1]);
  }

  function editShortcut(directory) { // either edit current shortcut OR make new shortcut
    var linkPath = process.env.APPDATA + '\\Microsoft\\Windows\\Start Menu\\Programs\\' + appName + '.lnk';
    console.log('actual exe', appPath + '\\' + directory.name + '\\' + appName + '.exe'); // need to make sure the name of the .exe matches the name of the project in package.json. here it does not!
    if(fs.existsSync(linkPath)) {
      ws.edit(linkPath, appPath + '\\' + directory.name + '\\' + 'windows-comms.exe');
    } else {
      ws.create(linkPath, appPath + '\\' + directory.name + '\\' + 'windows-comms.exe');
    }
  }

  readAppData();
// }