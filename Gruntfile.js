module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    'create-windows-installer': {
      ia32: {
        appDirectory: '/build/windows-comms-win32-ia32',
        outputDirectory: '/build/installer32',
        name: 'windows-comms',
        description: 'carmen\'s app',
        authors: 'Queen Carmen',
        exe: 'windows-comm.exe'
      }
    }
  });

  grunt.loadNpmTasks('grunt-electron-installer');

  grunt.registerTask('default', ['create-windows-installer']);
}
