var electron = require('electron');
// Module to control application life.
var app = electron.app;
// Module to create native browser window.
var BrowserWindow = electron.BrowserWindow;
var ipcMain = electron.ipcMain;
var GhReleases = require('electron-gh-releases');
// console.log('ghreleases', GhReleases);

// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;

    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {
      console.log('err', error);
    }

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Optionally do things such as:
      // - Add your .exe to the PATH
      // - Write to the registry for things like file associations and
      //   explorer context menus

      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':
      // Undo anything you did in the --squirrel-install and
      // --squirrel-updated handlers

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':
      // This is called on the outgoing version of your app before
      // we update to the new version - it's the opposite of
      // --squirrel-updated

      app.quit();
      return true;
  }
};

function checkForNewVersion() {
  someError('check for new version');
  // this checks for a new version of the app
  let options = {
    repo: 'carmalou/windows-comm-electron-test',
    currentVersion: app.getVersion()
  }

  console.log('currentVersion ', options.currentVersion);
  console.log('repo ', options.repo);
  someError('currentVersion ', options.currentVersion);

  const updater = new GhReleases(options)

  // Check for updates
  // `status` returns true if there is a new update available
  updater.check((err, status) => {
    if(err) {
      console.log('error in version check!', err);
      someError('error in version check!', err);
      someError(err);
    }
    console.log('status', status);
    someError('status');
    someError(status);
    if (!err && status) {
      // Download the update
      updater.download()
    }
  })

  // When an update has been downloaded
  updater.on('update-downloaded', (info) => {
    // Restart the app and install the update
    someError('update downloaded');
    updater.install()
  })

  // Access electrons autoUpdater
  updater.autoUpdater
}

console.log('before checkForNewVersion func');
checkForNewVersion();

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
