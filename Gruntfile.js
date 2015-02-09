module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.config('jshint', {
    files: [
      'Gruntfile.js',
      'index.js',
      'lib/**/*.js',
      'test/**/*.js'
    ],
    options: {
      esnext: true,
      indent: 2,
      asi: false,
      laxbreak: true,
      laxcomma: true,
      loopfunc: false,
      eqeqeq: true,
      immed: true,
      latedef: true,
      newcap: true,
      noarg: true,
      sub: true,
      undef: true,
      unused: true,
      eqnull: true,
      node: true,
      browser: false,
      globals: {
        // Mocha
        "describe"   : false,
        "it"         : false,
        "before"     : false,
        "after"      : false
      }
    }
  });

  grunt.registerTask('default', ['jshint']);
};
