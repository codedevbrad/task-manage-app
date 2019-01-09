
module.exports = function(grunt) {

  // var STATE = 'FRONT';
  grunt.registerTask('test', function () {

    console.log('concatinated files and minified !!!');
  });

  grunt.initConfig ({

    // combine files into a 1 production file ...
    concat: {

      // server app
      css1: {
        src: [ 'app-server/css/layout.css', 'modules/modules.css', 'app-server/css/workspaces.css', 'app-server/css/workspace.css', 'app-server/css/stack.css'],
        dest: 'app-server/build/client.css',
      },
      js1: {
        src: [ 'modules/modules.js', 'app-server/js/space_load.js', 'app-server/js/workspaces.js', 'app-server/js/workspace.js'], dest: 'app-server/build/client.js',
      },

      // explore app
      css2: {
        src: ['app-explore/css/index.css', 'app-explore/css/user-form.css'],
        dest: 'app-explore/build/client.css',
      },
      js2: {
        src: [ 'app-explore/js/user-form.js'], dest: 'app-explore/build/client.js',
      },
    },

    // minify js ...
    uglify: {
      server:  { files: {'app-server/build/client.min.js':  ['app-server/build/client.js']  } },
      explore: { files: {'app-explore/build/client.min.js': ['app-explore/build/client.js'] } }
    },

    // minify css ...
    cssmin : {
      server:  { files: {'app-server/build/client.min.css':  ['build/client.css'] } },
      explore: { files: {'app-explore/build/client.min.css': ['build/client.css'] } }
    },


    // watch for any file changes ...
    watch: {

      serverjs:  { files: ['app-server/js/**/*.js'],   tasks: ['concat', 'uglify'],  },
      servercss: { files: ['app-server/css/**/*.css'], tasks: ['concat', 'cssmin'],  },

      explorejs:  { files: ['app-explore/js/**/*.js'],   tasks: ['concat', 'uglify'],  },
      explorecss: { files: ['app-explore/css/**/*.css'], tasks: ['concat', 'cssmin'],  },
    },
  });

  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  require('time-grunt')(grunt);


};
