
module.exports = function(grunt) {

  grunt.registerTask('speak', function () { console.log("i'm speaking !!! "); });

  grunt.registerTask('yell', function () {  console.log("i'm YELLING !!! ");  });

  grunt.registerTask('both', ['speak', 'yell'] );

  grunt.registerTask('dev',['sass','jshint']);

  grunt.initConfig ({

    // sass compile
    sass: {
      css: {	files: {'build/client.css' : 'client.scss'	}	}
    },


    // watch for any file changes ...
    watch: {
      css: { files: '**/*.scss', tasks: ['sass']    }
    },

  });


  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');



};
