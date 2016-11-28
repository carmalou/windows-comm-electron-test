module.exports = function convertFiles() {
  var logIt = require('./writeLogs.js');
  logIt('convertFiles start');

  var fs = require('fs');
  var os = require('os');
  var path = require('path');
  var packagePath = os.homedir() + '\\AppData\\Local\\electron_quick_start\\packages';

  logIt('fs');
  logIt(fs);

  function deleteNugetFiles(path) {
    console.log('deleteNugetFiles');
    logIt('deleteNugetFiles');
    logIt('path = ' + path);
    fs.readdir(path, function(err, files) {
      logIt('readdir in deleteNugetFiles');
      if(err) {
        console.log('err on line 10!', err);
        logIt('err on line 13');
        logIt(err);
      } else {
        console.log('files', files);
        var tmpArr = files.filter(getExt);
        console.log('tmpArr ', tmpArr);
        logIt('tmpArr');
        logIt(tmpArr);
        checkAndDelete(path, tmpArr);
      }
    });
  }

  function checkAndDelete(path, files) {
    console.log('checkAndDelete');
    logIt('checkAndDelete');
    logIt('files.length = ' + files.length);
    logIt('path = ' + path);
    for(var i = 0; i < files.length; i++) {
      fs.unlink(path + '\\' + files[i], function(err) {
        if(err) {
          console.log('line 21 err ', err);
          logIt('err');
          logIt(err);
        }
      });
    }
    if(path === packagePath) {
      return;
    } else {
      getFiles();
    }
  }

  function getFiles() {
    logIt('getFiles');
    fs.readdir(packagePath, function(err, files) {
      if(err) {
        console.log('Error on line 20!', err);
        logIt('err');
        logIt(err);
        return;
      } else {
        var tmpArr = files.filter(getExt);
        console.log('tmpArr ', tmpArr);
        logIt('tmpArr')
        logIt(tmpArr);
        loopOverFiles(tmpArr);
      }
    });
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
    logIt('readFiles');
    var absolutePath = packagePath + '\\' + file;
    fs.readFile(absolutePath, 'utf8', function(err, data) {
      if(err) {
        console.log('error on line 32 ', err);
        logIt('error on line 77');
        logIt(err);
      } else {
        console.log('else!');
        var tmpObj = {
          fileName: file,
          data: data
        };
        writeFiles(tmpObj);
      }
    });
  }

  function loopOverFiles(files) {
    console.log('loopOverFiles');
    logIt('loopOverFiles');
    for(var i = 0; i < files.length; i++) {
      readFiles(files[i]);
    }
  }

  function writeFiles(fileObj) {
    logIt('writeFiles');
    var newPath = __dirname + '\\' + fileObj.fileName;
    logIt('newPath');
    logIt(newPath);
    fs.writeFile(newPath, fileObj.data, function(err) {
      if(err) {
        console.log('Error on line 59 ', err);
        logIt('err on line 105');
        logIt(err);
      } else {
        console.log('Success!');
        logIt('Success on line 109!');
        deleteNugetFiles(packagePath);
      }
    });
  }

  deleteNugetFiles(__dirname);
}
