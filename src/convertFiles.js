var fs = require('fs');
var os = require('os');
var path = require('path');
var logIt = require('./writeLogs.js');
var packagePath = os.homedir() + '\\AppData\\Local\\electron_quick_start\\packages';

function getFiles() {
  fs.readdir(packagePath, function(err, files) {
    if(err) {
      console.log('Error on line 7!', err);
      // logIt(err);
      return;
    } else {
      var tmpArr = files.filter(getExt);
      console.log('tmpArr ', tmpArr);
      loopOverFiles(tmpArr);
    }
  })
};

function getExt(file) {
  if(file === 'RELEASES') {
    return true;
  }
  if(path.extname(file) === '.nupkg') {
    return true;
  }
}

function readFiles(file) {
  fs.readFile(packagePath + '\\' + file, 'utf8', function(err, data) {
    if(err) {
      console.log('error on line 32 ', err);
    } else {
      console.log('else!');
      // console.log('data ', data);
    }
  })
}

function loopOverFiles(files) {
  console.log('loopOverFiles');
  for(var i = 0; i < files.length; i++) {
    readFiles(files[i]);
  }
}

console.log('dirname ', __dirname);

function writeFiles(file) {
  // fs.writeFile

}

getFiles();
