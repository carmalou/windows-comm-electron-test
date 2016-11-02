// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var changeYourName = document.getElementById('name');
var ipcRenderer = require('electron').ipcRenderer;
var packageDotJson = require('./package.json');

console.log('version no. ' + packageDotJson.version);

console.log('ipcRenderer', ipcRenderer);

function openTheWindow() {
  console.log('openTheWindow');
  ipcRenderer.send('open-name-window');
}

function logTheError(error) {
  console.log('from main ');
  console.log(error);
}

ipcRenderer.on('render-the-name', function(event, name) {
  console.log('name', name);
  console.log('new log statement to check');
  changeYourName.innerHTML = name;
});

ipcRenderer.on('log-the-error', function(event, error) {
  logTheError(error);
})

changeYourName.addEventListener('click', openTheWindow);
