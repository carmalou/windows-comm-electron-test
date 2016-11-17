var fs = require('fs');
var os = require('os');
var path = require('path');
var logIt = require('./writeLogs.js');
var packagePath = os.homedir() + '\\AppData\\Local\\electron_quick_start\\packages';

function deleteNugetFiles(path) {
  console.log('deleteNugetFiles');
  fs.readdir(path, function(err, files) {
    if(err) {
      console.log('err on line 10!', err);
    } else {
      console.log('files', files);
      var tmpArr = files.filter(getExt);
      console.log('tmpArr ', tmpArr);
      checkAndDelete(path, tmpArr);
    }
  });
}

function checkAndDelete(path, files) {
  console.log('checkAndDelete');
  for(var i = 0; i < files.length; i++) {
    fs.unlink(path + '\\' + files[i], function(err) {
      if(err) {
        console.log('line 21 err ', err);
      }
    });
  }
  if(path === packagePath) {
    return
  } else {
    getFiles();
  }
}

function getFiles() {
  fs.readdir(packagePath, function(err, files) {
    if(err) {
      console.log('Error on line 20!', err);
      // logIt(err);
      return;
    } else {
      var tmpArr = files.filter(getExt);
      console.log('tmpArr ', tmpArr);
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
  var absolutePath = packagePath + '\\' + file;
  fs.readFile(absolutePath, 'utf8', function(err, data) {
    if(err) {
      console.log('error on line 32 ', err);
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
  for(var i = 0; i < files.length; i++) {
    readFiles(files[i]);
  }
}

function writeFiles(fileObj) {
  var newPath = __dirname + '\\' + fileObj.fileName;
  fs.writeFile(newPath, fileObj.data, function(err) {
    if(err) {
      console.log('Error on line 59 ', err);
    } else {
      console.log('Success!');
      deleteNugetFiles(packagePath);
    }
  });
}

deleteNugetFiles(__dirname);
