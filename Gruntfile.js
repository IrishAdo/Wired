module.exports = function(grunt) {

  // Config.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['./source/javascript/*.js' ],
        tasks: [ 'concat:tp_boilerplate' ]
      }
    },
    concat: {
      tp_boilerplate: {
        src: './source/javascript/*.js',
        dest: './resources/javascript/script.gen.js'
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: ['./source/javascript/*.js']
    },
  });

  // Load the tasks...
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Default task.
  grunt.registerTask('default', 'watch');
}
