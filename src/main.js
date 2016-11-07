var electron = require('electron');
// Module to control application life.
var app = electron.app;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;
var ipcMain = electron.ipcMain;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow;
var nameWindow;

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600});

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

function someError(error) {
  ipcMain.emit('updater-issue', error);
}

ipcMain.on('updater-issue', function(error) {
  mainWindow.webContents.send('log-the-error', error);
});

ipcMain.on('open-name-window', function() {
  if(nameWindow != undefined) {
    return;
  }
  nameWindow = new BrowserWindow({ width: 400, height: 300 });
  nameWindow.loadURL(`file://${__dirname}/changeName.html`);
  nameWindow.on('closed', function() {
    nameWindow = null;
  });
});

ipcMain.on('update-the-name', function(event, name) {
  // event.sender.send('render-the-name', name); // communicate with the window that sent the initial message
  mainWindow.webContents.send('render-the-name', name); // communicate with a specific window
  nameWindow.close(); // close new window
});
