var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: './build/windows-comms-win32-ia32',
    outputDirectory: './build/installer32',
    authors: 'Queen Carmen',
    exe: 'windows-comms.exe'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
