// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

var changeYourName = document.getElementById('name');
var ipcRenderer = require('electron').ipcRenderer;

console.log('ipcRenderer', ipcRenderer);

function openTheWindow() {
  console.log('openTheWindow');
  ipcRenderer.send('open-name-window');
}

ipcRenderer.on('render-the-name', function(event, name) {
  console.log('name', name);
  console.log('new log statement to check');
  changeYourName.innerHTML = name;
});

changeYourName.addEventListener('click', openTheWindow);
