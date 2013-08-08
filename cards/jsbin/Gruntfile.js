module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var glazierCardGruntConfig = require('glazier-card-grunt-config'),
    sharedConfig = glazierCardGruntConfig.createSharedConfig(grunt);

  sharedConfig.shell = {
    outputCard: {
      command: 'cd ../glazier-jsbin-output && grunt',
      options: {
        stdout: true,
        stderr: true,
        failOnError: true
      }
    }
  };

  sharedConfig.symlink.outputCard = {
    files: [{
      expand: true,
      cwd: '../glazier-jsbin-output/dist/dev/glazier-jsbin-output/',
      src: ['card.js'],
      dest: 'dist/dev/<%= pkg.name %>/test/cards/glazier-jsbin-output/'
    }]
  };

  grunt.initConfig(sharedConfig);
  glazierCardGruntConfig.registerSharedTasks(grunt);

  grunt.renameTask('build', 'buildWithoutOutputCard');
  grunt.registerTask('build', ['shell:outputCard', 'buildWithoutOutputCard']);
};
